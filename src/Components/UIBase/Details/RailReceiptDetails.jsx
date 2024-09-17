import React, { useState } from "react";
import { DataTable } from "@scuf/datatable";
import {
  DatePicker,
  Input,
  Select,
  Icon,
  Tab,
  Button,
  Checkbox,
  Modal,
  Accordion,
} from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import * as Constants from "../../../JS/Constants";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import {
  handleIsRequiredCompartmentCell,
  getCurrentDateFormat,
} from "../../../JS/functionalUtilities";

RailReceiptDetails.propTypes = {
  modRailReceiptCompartmentPlanList: PropTypes.array.isRequired,
  railReceipt: PropTypes.object.isRequired,
  modRailReceipt: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    shareholders: PropTypes.array,
    terminalCodes: PropTypes.array,
    quantityUOMOptions: PropTypes.array,
    carrierCompanyOptions: PropTypes.array,
    railWagonOptions: PropTypes.object,
    finishedProductOptions: PropTypes.object,
    Suppliers: PropTypes.array,
    OriginTerminals: PropTypes.array,
  }).isRequired,
  selectedCompRow: PropTypes.array.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAssociationSelectionChange: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  viewTab: PropTypes.number.isRequired,
  handleAttributeCellDataEdit: PropTypes.func.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  attributeValidationErrors: PropTypes.array.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  compartmentDetailsPageSize: PropTypes.number.isRequired,
  expandedRows: PropTypes.array.isRequired,
  railLookUpData: PropTypes.object.isRequired,
  WagonDetailTab: PropTypes.array.isRequired,
  isTransloading: PropTypes.bool.isRequired,
};
RailReceiptDetails.defaultProps = { isEnterpriseNode: false };
export function RailReceiptDetails({
  modRailReceiptCompartmentPlanList,
  railReceipt,
  modRailReceipt,
  modAssociations,
  validationErrors,
  listOptions,
  selectedCompRow,
  onFieldChange,
  onAllTerminalsChange,
  handleCellDataEdit,
  handleAttributeCellDataEdit,
  handleAssociationSelectionChange,
  handleAddAssociation,
  handleDeleteAssociation,
  isEnterpriseNode,
  viewTab,
  enableHSEInspection,
  selectedAttributeList,
  attributeValidationErrors,
  onTabChange,
  toggleExpand,
  handleCompAttributeCellDataEdit,
  compartmentDetailsPageSize,
  expandedRows,
  railLookUpData,
  WagonDetailTab,
  isTransloading,
  currentAccess,
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
  const [modelOpen, setModelOpen] = useState(false);
  const [modCellData, setModCellData] = useState([]);
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

  const handleRailWagonEditDropDown = (cellData) => {
    let railWagonOptions = [];
    if (
      listOptions.railWagonOptions !== null ||
      listOptions.railWagonOptions !== undefined
    ) {
      if (
        listOptions.railWagonOptions[cellData.rowData.CarrierCompanyCode] !==
        undefined &&
        Array.isArray(
          listOptions.railWagonOptions[cellData.rowData.CarrierCompanyCode]
        )
      ) {
        listOptions.railWagonOptions[
          cellData.rowData.CarrierCompanyCode
        ].forEach((railWagon) =>
          railWagonOptions.push({ text: railWagon, value: railWagon })
        );
      }
    }
    return handleCustomEditDropDown(cellData, railWagonOptions);
  };
  const handleSupplierEditDropDown = (cellData) => {
    let supplierOptions = [];
    if (
      listOptions.supplierDestinationOptions[
      cellData.rowData["ShareholderCode"]
      ] !== undefined &&
      listOptions.supplierDestinationOptions[
      cellData.rowData["ShareholderCode"]
      ] !== null
    ) {
      Object.keys(
        listOptions.supplierDestinationOptions[
        cellData.rowData["ShareholderCode"]
        ]
      ).forEach((customer) =>
        supplierOptions.push({ text: customer, value: customer })
      );
    }
    return handleCustomEditDropDown(cellData, supplierOptions);
  };
  const handleOriginalTerminalEditDropDown = (cellData) => {
    let destinationOptions = [];
    if (
      listOptions.supplierDestinationOptions[
      cellData.rowData["ShareholderCode"]
      ] !== undefined &&
      listOptions.supplierDestinationOptions[
      cellData.rowData["ShareholderCode"]
      ] !== null
    ) {
      if (
        listOptions.supplierDestinationOptions[
        cellData.rowData["ShareholderCode"]
        ][cellData.rowData.SupplierCode] !== undefined &&
        Array.isArray(
          listOptions.supplierDestinationOptions[
          cellData.rowData["ShareholderCode"]
          ][cellData.rowData.SupplierCode]
        )
      ) {
        listOptions.supplierDestinationOptions[
          cellData.rowData["ShareholderCode"]
        ][cellData.rowData.SupplierCode].forEach((destination) =>
          destinationOptions.push({ text: destination, value: destination })
        );
      }
    }
    return handleCustomEditDropDown(cellData, destinationOptions);
  };
  const handleProductEditDropDown = (cellData) => {
    let finishedProductOptions = [];
    if (
      listOptions.finishedProductOptions !== undefined &&
      listOptions.finishedProductOptions !== null
    ) {
      if (
        listOptions.finishedProductOptions[cellData.rowData.ShareholderCode] !==
        undefined &&
        Array.isArray(
          listOptions.finishedProductOptions[cellData.rowData.ShareholderCode]
        )
      ) {
        listOptions.finishedProductOptions[
          cellData.rowData.ShareholderCode
        ].forEach((productCode) =>
          finishedProductOptions.push({ text: productCode, value: productCode })
        );
      }
    }
    return handleCustomEditDropDown(cellData, finishedProductOptions);
  };
  const decimalDisplayValues = (cellData) => {
    const { value } = cellData;
    if (typeof value === "number") {
      return value.toLocaleString();
    } else {
      return value;
    }
  };

  const DisableEnableControl = () => {
    return currentAccess.ViewRailReceipt_Update
      ? !currentAccess.ViewRailReceipt_Update
      : modRailReceipt.ReceiptStatus !== Constants.Shipment_Status.READY;
  };

  const checkBoxInDataTable = (cellData) => {
    let rowIndex = modRailReceiptCompartmentPlanList.findIndex(
      (item) => item.SequenceNo === cellData.rowData.SequenceNo
    );
    return (
      <div>
        {modRailReceipt.ReceiptStatus === Constants.Receipt_Status.READY ||
          modRailReceiptCompartmentPlanList[rowIndex].ReceiptCompartmentStatus ===
          Constants.ReceiptCompartment_Status.FORCE_COMPLETED ||
          modRailReceiptCompartmentPlanList[rowIndex].ReceiptCompartmentStatus ===
          Constants.ReceiptCompartment_Status.UNLOADING ||
          cellData.rowData.ReceiptCompartmentStatus ===
          Constants.ReceiptCompartment_Status.FORCE_COMPLETED ||
          cellData.rowData.ReceiptCompartmentStatus ===
          Constants.ReceiptCompartment_Status.UNLOADING ? (
          <div style={{ textAlign: "center" }}>
            <Checkbox
              checked={
                cellData.rowData.ReceiptCompartmentStatus ===
                  Constants.ReceiptCompartment_Status.FORCE_COMPLETED
                  ? true
                  : false
              }
              disabled={true}
            />
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Checkbox
              checked={
                modRailReceiptCompartmentPlanList[rowIndex][cellData.field]
              }
              disabled={false}
              onClick={() => {
                if (
                  !modRailReceiptCompartmentPlanList[rowIndex][cellData.field]
                ) {
                  setModCellData(cellData);
                  setModelOpen(true);
                } else {
                  handleCellDataEdit("", cellData);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  };
  const IsTransloadingInDataTable = (cellData) => {
    let rowIndex = modAssociations.findIndex(
      (item) => item.SequenceNo === cellData.rowData.SequenceNo
    );
    return (
      <div>
        <Checkbox
          checked={modAssociations[rowIndex][cellData.field]}
          onClick={() => {
            handleCellDataEdit("", cellData);
          }}
        />
      </div>
    );
  };
  const handleAttributeType = (data) => {
    //debugger;
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
    const open =
      expandedRows.findIndex(
        (x) => x.SequenceNo === data.rowData.compSequenceNo
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

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailReceipt.ReceiptCode}
                indicator="required"
                disabled={railReceipt.ReceiptCode !== ""}
                onChange={(data) => onFieldChange("ReceiptCode", data)}
                label={t("Rail_Receipt_Code")}
                error={t(validationErrors.ReceiptCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modRailReceipt.ScheduledDate === null
                    ? ""
                    : new Date(modRailReceipt.ScheduledDate)
                }
                label={t("Rail_Receipt_ArrivalDateTime")}
                type="datetime"
                showYearSelector="true"
                disablePast={false}
                displayFormat={getCurrentDateFormat()}
                disabled={
                  DisableEnableControl() ||
                  modRailReceipt.CreatedFromEntity !== 0
                }
                minuteStep={5}
                indicator="required"
                onChange={(data) => onFieldChange("ScheduledDate", data)}
                error={t(validationErrors.ScheduledDate)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailReceipt.Description}
                onChange={(data) => onFieldChange("Description", data)}
                label={t("Rail_Receipt_Desc")}
                error={t(validationErrors.Description)}
                disabled={
                  DisableEnableControl() ||
                  modRailReceipt.CreatedFromEntity !== 0
                }
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                indicator="required"
                label={t("Rail_Receipt_QuantityUOM")}
                value={modRailReceipt.QuantityUOM}
                options={listOptions.quantityUOMOptions}
                onChange={(data) => {
                  onFieldChange("QuantityUOM", data);
                }}
                disabled={
                  DisableEnableControl() ||
                  modRailReceipt.CreatedFromEntity !== 0
                }
                error={t(validationErrors.QuantityUOM)}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailReceipt.ReceiptStatus}
                onChange={(data) => onFieldChange("ReceiptStatus", data)}
                label={t("Rail_Receipt_ReceiptStatus")}
                disabled={true}
                reserveSpace={false}
              />
            </div>
            {isEnterpriseNode ? (
              <>
                <div className="col-12 col-md-6 col-lg-4">
                  <AssociatedTerminals
                    terminalList={listOptions.terminalCodes}
                    selectedTerminal={modRailReceipt.TerminalCodes}
                    error={validationErrors.TerminalCodes}
                    onFieldChange={onFieldChange}
                    onCheckChange={onAllTerminalsChange}
                  ></AssociatedTerminals>
                </div>
                {railReceipt.ReceiptCode === "" ||
                  railReceipt.ReceiptCode === undefined ||
                  railReceipt.ReceiptCode === null ? (
                  ""
                ) : (
                  <div className="col-12 col-md-6 col-lg-4">
                    {/* <Select
                      fluid
                      label={t("Shipment_LoadedTerminal")}
                      value={modRailReceipt.ActualTerminalCode}
                      multiple={true}
                      options={Utilities.transferListtoOptions(
                        modRailReceipt.ActualTerminalCode
                      )}
                      // onChange={(data) => onFieldChange("TerminalCodes", data)}
                      // error={t(validationError)}
                      disabled={true}
                      reserveSpace={false}
                    /> */}
                    <Input
                      fluid
                      placeholder=""
                      label={t("Shipment_LoadedTerminal")}
                      value={modRailReceipt.ActualTerminalCode}
                      disabled={true}
                    />
                  </div>
                )}
              </>
            ) : (
              ""
            )}
          </div>
          {selectedAttributeList.length > 0
            ? selectedAttributeList.map((attribute) => (
              <ErrorBoundary>
                <Accordion>
                  <Accordion.Content
                    className="attributeAccordian"
                    title={
                      isEnterpriseNode
                        ? attribute.TerminalCode +
                        " - " +
                        t("Attributes_Header")
                        : t("Attributes_Header")
                    }
                  >
                    <AttributeDetails
                      selectedAttributeList={attribute.attributeMetaDataList}
                      handleCellDataEdit={handleAttributeCellDataEdit}
                      attributeValidationErrors={handleValidationErrorFilter(
                        attributeValidationErrors,
                        attribute.TerminalCode
                      )}
                    ></AttributeDetails>
                  </Accordion.Content>
                </Accordion>
              </ErrorBoundary>
            ))
            : null}

          <div className="shipmentTabAlignment">
            <Tab
              defaultActiveIndex={viewTab}
              className="col-12"
              onTabChange={onTabChange}
            >
              <Tab.Pane title={t("RailDispatchPlanDetail_PlanHeader")}>
                <div className="row compartmentRow">
                  <div className="col col-md-8 col-lg-9 col col-xl-9">
                    {/* <h4>{t("Trailer_CompartmentInfo")}</h4> */}
                  </div>
                  <div className="col col-md-4 col-lg-3 col-xl-3">
                    <div className="compartmentIconContainer">
                      <div
                        onClick={handleAddAssociation}
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
                  </div>
                </div>

                <div className="row marginRightZero tableScroll">
                  <div className="col-12 detailsTable">
                    <DataTable
                      data={modAssociations}
                      selectionMode="multiple"
                      selection={selectedCompRow}
                      onSelectionChange={handleAssociationSelectionChange}
                      rowExpansionTemplate={rowExpansionTemplate}
                      expandedRows={expandedRows}
                    >
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="CarrierCompanyCode"
                        field="CarrierCompanyCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Rail_Receipt_Carrier")
                        )}
                        editable={!DisableEnableControl()}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleCustomEditDropDown(
                            celldata,
                            listOptions.carrierCompanyOptions
                          )
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="TrailerCode"
                        field="TrailerCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Rail_Receipt_Wagon")
                        )}
                        editable={!DisableEnableControl()}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleRailWagonEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="ShareholderCode"
                        field="ShareholderCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Rail_Receipt_Shareholder")
                        )}
                        editable={!DisableEnableControl()}
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
                        key="FinishedProductCode"
                        field="FinishedProductCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Rail_Receipt_Product")
                        )}
                        editable={!DisableEnableControl()}
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
                          t("Rail_Receipt_Supplier")
                        )}
                        editable={!DisableEnableControl()}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleSupplierEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="OriginTerminalCode"
                        field="OriginTerminalCode"
                        header={handleIsRequiredCompartmentCell(
                          t("Rail_Receipt_OriginCode")
                        )}
                        editable={!DisableEnableControl()}
                        editFieldType="text"
                        customEditRenderer={(celldata) =>
                          handleOriginalTerminalEditDropDown(celldata)
                        }
                      ></DataTable.Column>
                      {railLookUpData.PlanType === "1" ? (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          key="Quantity"
                          field="Quantity"
                          header={handleIsRequiredCompartmentCell(
                            t("Rail_Receipt_Quantity")
                          )}
                          editable={!DisableEnableControl()}
                          editFieldType="number"
                          renderer={(cellData) =>
                            decimalDisplayValues(cellData)
                          }
                          customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>
                      ) : null}
                      {railReceipt.ReceiptStatus === "CLOSED" ||
                        !isTransloading ? (
                        ""
                      ) : (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          key="IsTransloading"
                          field="IsTransloading"
                          header={t("Device_Transloading")}
                          renderer={(cellData) =>
                            IsTransloadingInDataTable(cellData)
                          }
                        ></DataTable.Column>
                      )}

                      <DataTable.Column
                        className="expandedColumn"
                        initialWidth="200px"
                        renderer={expanderTemplate}
                      />
                    </DataTable>
                  </div>
                </div>
              </Tab.Pane>
              {WagonDetailTab.map((index) => {
                return (
                  <Tab.Pane title={t("ViewRailDispatchList_WagonDetails")}>
                    <div className="row marginRightZero tableScroll">
                      <div className="col-12 detailsTable">
                        <DataTable
                          data={modRailReceiptCompartmentPlanList}
                          scrollable={true}
                        >
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="TrailerCode"
                            field="TrailerCode"
                            header={t("Rail_Wagon_Code")}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="CarrierCompanyCode"
                            field="CarrierCompanyCode"
                            header={t("DriverInfo_Carrier")}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="FinishedProductCode"
                            field="FinishedProductCode"
                            header={t("Rail_Receipt_Product")}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="ReceiptCompartmentStatus"
                            field="ReceiptCompartmentStatus"
                            header={t("Reconciliation_Status")}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="PlannedQuantity"
                            field="PlannedQuantity"
                            header={t(
                              "ViewShipmentCompartment_PlannedQuantity"
                            )}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="RevisedQuantity"
                            field="RevisedQuantity"
                            header={t(
                              "ViewMarineShipmentList_RevisedPlannedQuantity"
                            )}
                          ></DataTable.Column>

                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="UnloadedQuantity"
                            field="UnloadedQuantity"
                            header={t("ContractInfo_LoadedQty")}
                          ></DataTable.Column>

                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="TareWeight"
                            field="TareWeight"
                            header={t("Trailer_Tareweight")}
                          ></DataTable.Column>

                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="LadenWeight"
                            field="LadenWeight"
                            header={t("PCDET_Planning_gvLadenWeight")}
                          ></DataTable.Column>
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="DiffWeight"
                            field="DiffWeight"
                            header={t("Weight_Difference")}
                          ></DataTable.Column>
                          {enableHSEInspection ? (
                            <DataTable.Column
                              className="compColHeight colminWidth"
                              key="HSEInspectionStatus"
                              field="HSEInspectionStatus"
                              header={t("VehHSE_InspectionStatus")}
                            ></DataTable.Column>
                          ) : null}
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="ForceComplete"
                            field="ForceComplete"
                            header={t("ViewMarineReceiptList_ForceComplete")}
                            renderer={(cellData) =>
                              checkBoxInDataTable(cellData)
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
                    onClick={() => {
                      setModelOpen(false);
                    }}
                  />
                  <Button
                    type="primary"
                    content={t("PipelineDispatch_BtnSubmit")}
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
