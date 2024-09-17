import React from "react";
import { DataTable } from "@scuf/datatable";
import {
  DatePicker,
  Input,
  Select,
  Icon,
  Tab,
  Accordion,
  Checkbox,
} from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import {
  getOptionsWithSelect,
  getCurrentDateFormat,
  handleIsRequiredCompartmentCell,
} from "../../../JS/functionalUtilities";
import * as Constants from "./../../../JS/Constants";
import * as Utilities from "../../../JS/Utilities";

RailDispatchDetails.propTypes = {
  railDispatch: PropTypes.object.isRequired,
  modRailDispatch: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  modWagonDetails: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    shareholders: PropTypes.array,
    terminalCodes: PropTypes.array,
    quantityUOMs: PropTypes.array,
    routeCodes: PropTypes.array,
    railWagonCategories: PropTypes.array,
    contractCodes: PropTypes.array,
    createdFromEntities: PropTypes.array,
    finishedProducts: PropTypes.object,
  }).isRequired,
  selectedAssociations: PropTypes.array.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  onAssociationSelectionChange: PropTypes.func.isRequired,
  onCellDataEdit: PropTypes.func.isRequired,
  onAddAssociation: PropTypes.func.isRequired,
  onDeleteAssociation: PropTypes.func.isRequired,
  onRouteSearchChange: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  WagonDetailTab: PropTypes.array.isRequired,
  shipmentSource: PropTypes.number,
};
RailDispatchDetails.defaultProps = {
  genericProps: { transportationType: "RAIL" },
  isEnterpriseNode: false,
};

export function RailDispatchDetails({
  railDispatch,
  modRailDispatch,
  modAssociations,
  modWagonDetails,
  validationErrors,
  listOptions,

  attributeValidationErrors,
  onAttributeCellDataEdit,
  onCompAttributeCellDataEdit,
  selectedAttributeList,
  expandedRows,
  toggleExpand,

  railRouteData,
  selectedAssociations,
  tabActiveIndex,
  onFieldChange,
  onDateTextChange,
  onAllTerminalsChange,
  onAssociationSelectionChange,
  onCellDataEdit,
  onWagonCellDataEdit,
  onAddAssociation,
  onDeleteAssociation,
  onRouteSearchChange,
  onTabChange,
  toggleWagonExpand,
  expandedWagonRows,
  currentAccess,
  isEnterpriseNode,
  compartmentDetailsPageSize,
  enableHSEInspection,
  railLookUpData,
  WagonDetailTab,
  shipmentSource,
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

  const handleCustomEditDropDown = (cellData, dropDownOptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={modAssociations[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownOptions}
        onChange={(value) => onCellDataEdit(value, cellData)}
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
        onChange={(value) => onCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };

  const handleCustomerEditDropDown = (cellData) => {
    const customerOptions = [];
    if (
      listOptions.customerDestinations[cellData.rowData["ShareholderCode"]] !==
      undefined &&
      listOptions.customerDestinations[cellData.rowData["ShareholderCode"]] !==
      null
    ) {
      Object.keys(
        listOptions.customerDestinations[cellData.rowData["ShareholderCode"]]
      ).forEach((customer) =>
        customerOptions.push({ text: customer, value: customer })
      );
    }
    return handleCustomEditDropDown(cellData, customerOptions);
  };

  const handleDestinationEditDropDown = (cellData) => {
    const destinationOptions = [];
    if (
      listOptions.customerDestinations[cellData.rowData["ShareholderCode"]] !==
      undefined &&
      listOptions.customerDestinations[cellData.rowData["ShareholderCode"]] !==
      null
    ) {
      if (
        listOptions.customerDestinations[cellData.rowData["ShareholderCode"]][
        cellData.rowData.CustomerCode
        ] !== undefined &&
        Array.isArray(
          listOptions.customerDestinations[cellData.rowData["ShareholderCode"]][
          cellData.rowData.CustomerCode
          ]
        )
      ) {
        listOptions.customerDestinations[cellData.rowData["ShareholderCode"]][
          cellData.rowData.CustomerCode
        ].forEach((destination) =>
          destinationOptions.push({ text: destination, value: destination })
        );
      }
    }
    return handleCustomEditDropDown(cellData, destinationOptions);
  };

  const handleProductEditDropDown = (cellData) => {
    const finishedProductOptions = [];
    if (
      listOptions.finishedProducts !== undefined &&
      listOptions.finishedProducts !== null
    ) {
      if (
        listOptions.finishedProducts[cellData.rowData.ShareholderCode] !==
        undefined &&
        Array.isArray(
          listOptions.finishedProducts[cellData.rowData.ShareholderCode]
        )
      ) {
        listOptions.finishedProducts[cellData.rowData.ShareholderCode].forEach(
          (productCode) =>
            finishedProductOptions.push({
              text: productCode,
              value: productCode,
            })
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

  const handleForceComplete = (cellData, isEnable) => {
    const forceCompleteEnable = !(
      currentAccess.ViewRailDispatch_EditAccess === false ||
      cellData.rowData.DispatchCompartmentStatus ===
      Constants.ShipmentCompartmentStatus.LOADING ||
      cellData.rowData.DispatchCompartmentStatus ===
      Constants.ShipmentCompartmentStatus.FORCE_COMPLETED ||
      cellData.rowData.DispatchCompartmentStatus ===
      Constants.ShipmentCompartmentStatus.COMPLETED ||
      cellData.rowData.DispatchCompartmentStatus ===
      Constants.ShipmentCompartmentStatus.OVER_FILLED ||
      currentAccess.ViewRailDispatch_DisableWagonForceClose ||
      cellData.rowData.FinishedProductCode === null ||
      cellData.rowData.FinishedProductCode === ""
    );
    return (
      <Checkbox
        disabled={!forceCompleteEnable}
        onChange={(checked) => onWagonCellDataEdit(checked, cellData)}
        checked={cellData.value}
      />
    );
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

  const DisableEnableControl = () => {
    return currentAccess.ViewRailDispatch_Update
      ? !currentAccess.ViewRailDispatch_Update
      : modRailDispatch.DispatchStatus !== Constants.Shipment_Status.READY;
  };

  const expanderTemplate = (data) => {
    const open =
      expandedRows.findIndex(
        (item) => item.SeqNumber === data.rowData.SeqNumber
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

  const handleAttributeType = (data) => {
    const attribute = data.rowData;
    try {
      return attribute.DataType.toLowerCase() ===
        Constants.DataType.STRING.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={attribute.IsReadonly}
          onChange={(value) => onCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : attribute.DataType.toLowerCase() ===
        Constants.DataType.INT.toLowerCase() ? (
        <Input
          fluid
          value={attribute.AttributeValue}
          disabled={attribute.IsReadonly}
          onChange={(value) => onCompAttributeCellDataEdit(data, value)}
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
          onChange={(value) => onCompAttributeCellDataEdit(data, value)}
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
          onChange={(value) => onCompAttributeCellDataEdit(data, value)}
        />
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
          onChange={(value) => onCompAttributeCellDataEdit(data, value)}
          reserveSpace={false}
        />
      ) : null;
    } catch (error) {
      console.log(
        "RailDispatchDetails: Error occurred on handleAttributeType",
        error
      );
    }
  };

  // let actualTerminalCode = [];
  // if (modRailDispatch.ActualTerminalCode !== null) {
  //   actualTerminalCode = modRailDispatch.ActualTerminalCode;
  // }

  const rowExpansionTemplate = (data) => {
    return Array.isArray(data.AttributesForUI) &&
      data.AttributesForUI.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable
          data={data.AttributesForUI}
          rows={compartmentDetailsPageSize}
        >
          {isEnterpriseNode ? (
            <DataTable.Column
              className="compColHeight"
              key="TerminalCode"
              field="TerminalCode"
              header={t("CompartmentTerminal")}
              editable={false}
            />
          ) : (
            ""
          )}
          <DataTable.Column
            className="compColHeight"
            key="AttributeName"
            header={t("CompartmentAttributeName")}
            renderer={handleIsRequiredCompAttributes}
            editable={false}
          />
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
  };

  const expanderWagonTemplate = (data) => {
    const open =
      expandedWagonRows.findIndex(
        (item) => item.TrailerCode === data.rowData.TrailerCode
      ) >= 0
        ? true
        : false;
    if (
      data.rowData.DispatchCompartmentStatus ===
      Constants.ShipmentCompartmentStatus.FORCE_COMPLETED
    ) {
      data.rowData.ForceComplete = true;
    }
    return (
      <div
        onClick={() => toggleWagonExpand(data.rowData, open)}
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

  const wagonRowExpansionTemplate = (data) => {
    let compData = [];
    compData.push(data);
    return Array.isArray(compData) && compData.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={compData} onEdit={onWagonCellDataEdit}>
          <DataTable.Column
            className="compColHeight"
            key="TareWeight"
            field="TareWeight"
            header={t("RailWagonConfigurationDetails_TareWeight")}
          />
          <DataTable.Column
            className="compColHeight"
            key="LadenWeight"
            field="LadenWeight"
            header={t("PCDET_Planning_gvLadenWeight")}
          />
          <DataTable.Column
            className="compColHeight"
            key="DiffWeight"
            field="DiffWeight"
            header={t("Weight_Difference")}
          />
        </DataTable>
      </div>
    ) : (
      <div className="compartmentIcon">
        <div className="gridButtonAlignLeft">
          {t("CustomerInventory_NoRecordsFound")}
        </div>
      </div>
    );
  };

  const inputInDataTable = (cellData) => {
    return (
      <div>
        {!(
          currentAccess.ViewRailDispatch_EditAccess === false ||
          cellData.rowData.DispatchCompartmentStatus ===
          Constants.ShipmentCompartmentStatus.LOADING ||
          cellData.rowData.DispatchCompartmentStatus ===
          Constants.ShipmentCompartmentStatus.FORCE_COMPLETED ||
          cellData.rowData.DispatchCompartmentStatus ===
          Constants.ShipmentCompartmentStatus.COMPLETED ||
          cellData.rowData.DispatchCompartmentStatus ===
          Constants.ShipmentCompartmentStatus.OVER_FILLED ||
          currentAccess.ViewRailDispatch_DisableAdjustPlanQty ||
          cellData.rowData.FinishedProductCode === null ||
          cellData.rowData.FinishedProductCode === ""
        ) ? (
          <Input
            fluid
            disabled={false}
            value={cellData.rowData.AdjustedQty}
            onChange={(value) => onWagonCellDataEdit(value, cellData)}
            reserveSpace={false}
          />
        ) : (
          <Input fluid disabled={true} />
        )}
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
                value={modRailDispatch.DispatchCode}
                indicator="required"
                disabled={railDispatch.DispatchCode !== ""}
                onChange={(data) => onFieldChange("DispatchCode", data)}
                label={t("RailDispatchPlanDetail_DispatchCode")}
                error={t(validationErrors.DispatchCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailDispatch.Description}
                label={t("RailDispatchPlanDetail_Description")}
                onChange={(data) => onFieldChange("Description", data)}
                error={t(validationErrors.Description)}
                reserveSpace={false}
                disabled={DisableEnableControl()}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                placeholder={t("Common_Select")}
                label={t("RailDispatchPlanDetail_RouteCode")}
                value={modRailDispatch.RouteCode}
                onChange={(data) => onFieldChange("RouteCode", data)}
                disabled={DisableEnableControl()}
                error={t(validationErrors.RouteCode)}
                options={getOptionsWithSelect(
                  listOptions.routeCodes,
                  t("Common_Select")
                )}
                search={true}
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
                onSearch={onRouteSearchChange}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DatePicker
                fluid
                value={
                  modRailDispatch.ScheduledDate === null
                    ? ""
                    : new Date(modRailDispatch.ScheduledDate)
                }
                label={t("RailDispatchPlanDetail_ScheduledDate")}
                type="datetime"
                displayFormat={getCurrentDateFormat()}
                disabled={DisableEnableControl()}
                disablePast={false}
                indicator="required"
                showYearSelector="true"
                onChange={(data) => onFieldChange("ScheduledDate", data)}
                onTextChange={(value, error) => {
                  onDateTextChange("ScheduledDate", value, error);
                }}
                error={t(validationErrors.ScheduledDate)}
                minuteStep="5"
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={railRouteData.DestinationCode}
                label={t("RailDispatchPlanDetail_FinalDestination")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                indicator="required"
                placeholder={t("Common_Select")}
                onChange={(data) =>
                  onFieldChange("CreatedFromEntity", parseInt(data))
                }
                label={t("RailDispatchPlanDetail_CreatedFromEntity")}
                options={listOptions.createdFromEntities}
                value={modRailDispatch.CreatedFromEntity}
                disabled={
                  DisableEnableControl() || shipmentSource !== undefined
                    ? true
                    : false
                }
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailDispatch.DispatchStatus}
                label={t("RailDispatchPlanDetail_RailStatus")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("RailDispatchPlanDetail_QuantityUOM")}
                value={modRailDispatch.QuantityUOM}
                multiple={false}
                indicator="required"
                options={listOptions.quantityUOMs}
                onChange={(data) => onFieldChange("QuantityUOM", data)}
                error={t(validationErrors.QuantityUOM)}
                disabled={
                  DisableEnableControl() ||
                  listOptions.quantityUOMs.length === 0
                }
                reserveSpace={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={railRouteData.DepartureTime}
                label={t("RailDispatchPlanDetail_DepartTime")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("Cust_Status")}
                value={modRailDispatch.Active}
                options={[
                  { text: t("ViewRailDispatchList_Ok"), value: true },
                  { text: t("ViewShipmentStatus_Inactive"), value: false },
                ]}
                onChange={(data) => onFieldChange("Active", data)}
                disabled={
                  DisableEnableControl() || railDispatch.DispatchCode === ""
                }
                noResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailDispatch.Remarks}
                label={t("Cust_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modRailDispatch.Active !== railDispatch.Active
                    ? "required"
                    : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
                disabled={
                  DisableEnableControl() || railDispatch.DispatchCode === ""
                }
              />
            </div>
            {isEnterpriseNode ? (
              <>
                <div className="col-12 col-md-6 col-lg-4">
                  <AssociatedTerminals
                    terminalList={listOptions.terminalCodes}
                    selectedTerminal={modRailDispatch.TerminalCodes}
                    error={validationErrors.TerminalCodes}
                    onFieldChange={onFieldChange}
                    onCheckChange={onAllTerminalsChange}
                  />
                </div>
                {railDispatch.DispatchCode === null ||
                  railDispatch.DispatchCode === undefined ||
                  railDispatch.DispatchCode === "" ? (
                  ""
                ) : (
                  <div className="col-12 col-md-6 col-lg-4">
                    {/* <Select
                      fluid
                      label={t("Shipment_LoadedTerminal")}
                      value={actualTerminalCode}
                      multiple={true}
                      options={Utilities.transferListtoOptions(
                        actualTerminalCode
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
                      value={modRailDispatch.ActualTerminalCode}
                      disabled={true}
                    />
                  </div>
                )}
              </>
            ) : null}
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
                      handleCellDataEdit={onAttributeCellDataEdit}
                      attributeValidationErrors={handleValidationErrorFilter(
                        attributeValidationErrors,
                        attire.TerminalCode
                      )}
                    />
                  </Accordion.Content>
                </Accordion>
              </ErrorBoundary>
            ))
            : null}

          <div className="shipmentTabAlignment">
            <Tab
              activeIndex={tabActiveIndex}
              onTabChange={(activeIndex) => {
                onTabChange(activeIndex);
              }}
            >
              <Tab.Pane title={t("RailDispatchPlanDetail_PlanHeader")}>
                <div className="row compartmentRow">
                  <div className="col col-md-8 col-lg-9 col col-xl-9">
                    {/* <h4>{t("RailDispatchPlanDetail_PlanHeader")}</h4> */}
                  </div>
                  <div className="col col-md-4 col-lg-3 col-xl-3">
                    <div className="compartmentIconContainer">
                      <div
                        onClick={onAddAssociation}
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
                        onClick={onDeleteAssociation}
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
                      rowExpansionTemplate={rowExpansionTemplate}
                      expandedRows={expandedRows}
                      scrollable={true}
                      scrollHeight="320px"
                      selectionMode="multiple"
                      selection={selectedAssociations}
                      onSelectionChange={onAssociationSelectionChange}
                    >
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="ShareholderCode"
                        field="ShareholderCode"
                        header={handleIsRequiredCompartmentCell(
                          t("RailDispatchPlanDetail_ShareHolderCode")
                        )}
                        editable={!DisableEnableControl()}
                        editFieldType="text"
                        customEditRenderer={(cellData) =>
                          handleCustomEditDropDown(
                            cellData,
                            listOptions.shareholders
                          )
                        }
                      />
                      {/* {(() => {
                        switch (modRailDispatch.CreatedFromEntity) {
                          case 2:
                            return (
                              <DataTable.Column
                                className="compColHeight"
                                key="ContractCode"
                                field="ContractCode"
                                header={handleIsRequiredCompartmentCell(t("RailDispatchPlanDetail_ContractCode"))}
                                editable={modRailDispatch.DispatchStatus === Constants.Shipment_Status.READY}
                                editFieldType="text"
                                customEditRenderer={(cellData) =>
                                  handleCustomEditDropDown(
                                    cellData,
                                    listOptions.contractCodes
                                  )
                                }
                              />
                            );
                          default:
                            return "";
                        }
                      })()} */}
                      {modRailDispatch.CreatedFromEntity === 2 ? (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          key="ContractCode"
                          field="ContractCode"
                          header={handleIsRequiredCompartmentCell(
                            t("RailDispatchPlanDetail_ContractCode")
                          )}
                          editable={!DisableEnableControl()}
                          editFieldType="text"
                          customEditRenderer={(cellData) =>
                            handleCustomEditDropDown(
                              cellData,
                              listOptions.contractCodes
                            )
                          }
                        />
                      ) : null}
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="FinishedProductCode"
                        field="FinishedProductCode"
                        header={handleIsRequiredCompartmentCell(
                          t("RailDispatchPlanDetail_FinishedProductCode")
                        )}
                        editable={!DisableEnableControl()}
                        editFieldType="text"
                        customEditRenderer={(cellData) =>
                          handleProductEditDropDown(cellData)
                        }
                      />
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="CustomerCode"
                        field="CustomerCode"
                        header={handleIsRequiredCompartmentCell(
                          t("RailDispatchPlanDetail_Customer")
                        )}
                        editable={!DisableEnableControl()}
                        editFieldType="text"
                        customEditRenderer={(cellData) =>
                          handleCustomerEditDropDown(cellData)
                        }
                      />
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="DestinationCode"
                        field="DestinationCode"
                        header={handleIsRequiredCompartmentCell(
                          t("RailDispatchPlanDetail_Destination")
                        )}
                        editable={!DisableEnableControl()}
                        editFieldType="text"
                        customEditRenderer={(cellData) =>
                          handleDestinationEditDropDown(cellData)
                        }
                      />
                      {railLookUpData.PlanType === "1" ? (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          key="PlannedQuantity"
                          field="PlannedQuantity"
                          header={handleIsRequiredCompartmentCell(
                            t("RailDispatchPlanDetail_Quantity")
                          )}
                          editable={!DisableEnableControl()}
                          editFieldType="text"
                          renderer={(cellData) =>
                            decimalDisplayValues(cellData)
                          }
                          customEditRenderer={handleCustomEditTextBox}
                        />
                      ) : null}
                      {railLookUpData.PlanType === "2" ? (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          key="RailWagonCategory"
                          field="RailWagonCategory"
                          header={handleIsRequiredCompartmentCell(
                            t("RailDispatchPlanDetail_RailWagonCategory")
                          )}
                          editable={!DisableEnableControl()}
                          editFieldType="text"
                          customEditRenderer={(cellData) =>
                            handleCustomEditDropDown(
                              cellData,
                              listOptions.railWagonCategories
                            )
                          }
                        />
                      ) : null}
                      {railLookUpData.PlanType === "2" ? (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          key="PlannedNoOfRailWagons"
                          field="PlannedNoOfRailWagons"
                          header={handleIsRequiredCompartmentCell(
                            t("RailDispatchPlanDetail_NoOfRailWagons")
                          )}
                          editable={!DisableEnableControl()}
                          editFieldType="text"
                          renderer={(cellData) =>
                            decimalDisplayValues(cellData)
                          }
                          customEditRenderer={handleCustomEditTextBox}
                        />
                      ) : null}
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
                          data={modWagonDetails}
                          rowExpansionTemplate={wagonRowExpansionTemplate}
                          expandedRows={expandedWagonRows}
                          scrollable={true}
                          scrollHeight="320px"
                        >
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="TrailerCode"
                            field="TrailerCode"
                            header={t("Rail_Receipt_Wagon")}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="CarrierCompanyCode"
                            field="CarrierCompanyCode"
                            header={t("Rail_Receipt_Carrier")}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="FinishedProductCode"
                            field="FinishedProductCode"
                            header={t("Rail_Receipt_Product")}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="DispatchCompartmentStatus"
                            field="DispatchCompartmentStatus"
                            header={t("ViewRailDispatchList_DispatchStatus")}
                            renderer={(cellData) => {
                              if (cellData.value !== null) {
                                return Utilities.getKeyByValue(
                                  Constants.ShipmentCompartmentStatus,
                                  cellData.value
                                );
                              }
                            }}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="PlannedQuantity"
                            field="PlannedQuantity"
                            header={t("ViewRailDispatchList_PlannedQuantity")}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="RevisedQuantity"
                            field="RevisedQuantity"
                            header={t(
                              "ViewRailDispatchList_RevisedPlannedQuantity"
                            )}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="LoadedQuantity"
                            field="LoadedQuantity"
                            header={t("ViewRailDispatchList_LoadedQuantity")}
                          />
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            key="ReturnQuantity"
                            field="ReturnQuantity"
                            header={t("ViewMarineShipmentList_ReturnQuantity")}
                          />

                          {enableHSEInspection ? (
                            <DataTable.Column
                              className="compColHeight colminWidth"
                              key="HSEInspectionStatus"
                              field="HSEInspectionStatus"
                              header={t("VehHSE_InspectionStatus")}
                              renderer={(cellData) => {
                                return Utilities.getKeyByValue(
                                  Constants.HSEInspectionStatus,
                                  parseInt(cellData.value)
                                );
                              }}
                            />
                          ) : null}
                          <DataTable.Column
                            className="compColHeight colminWidth"
                            field={"AdjustedQty"}
                            header={t("ViewMarineShipmentList_AdjustPlan")}
                            renderer={(cellData) => inputInDataTable(cellData)}
                          />
                          <DataTable.Column
                            className="compColHeight"
                            initialWidth="100px"
                            field="ForceComplete"
                            header={t("ViewShipment_ForceComplete")}
                            renderer={(cellData) =>
                              handleForceComplete(cellData)
                            }
                          />
                          <DataTable.Column
                            className="expandedColumn"
                            initialWidth="100px"
                            renderer={expanderWagonTemplate}
                          />
                        </DataTable>
                      </div>
                    </div>
                  </Tab.Pane>
                );
              })}
            </Tab>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
