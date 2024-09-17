import React from "react";
import { DataTable } from "@scuf/datatable";
import { DatePicker, Input, Select, Icon, Checkbox } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { handleIsRequiredCompartmentCell } from "../../../JS/functionalUtilities";
import * as Constants from "./../../../JS/Constants";

RailDispatchProductAssignmentDetails.propTypes = {
  listOptions: PropTypes.shape({
    shareholderCodes: PropTypes.array,
    contractCodes: PropTypes.array,
    finishedProductCodes: PropTypes.array,
    customerDestinations: PropTypes.array,
  }).isRequired,
  modRailWagonList: PropTypes.array.isRequired,
  onCellDataEdit: PropTypes.func.isRequired,
  createdFromEntity: PropTypes.number.isRequired,
};

export function RailDispatchProductAssignmentDetails({
  listOptions,
  modRailWagonList,
  onCellDataEdit,
  createdFromEntity,
  expandedRows,
  toggleExpand,
  onCompAttributeCellDataEdit,
  railLookUpData,
  compartmentDetailsPageSize,
  isEnterpriseNode,
}) {
  const [t] = useTranslation();

  const handleCustomEditDropDown = (cellData, dropDownOptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={modRailWagonList[cellData.rowIndex][cellData.field]}
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
        value={modRailWagonList[cellData.rowIndex][cellData.field]}
        onChange={(value) => onCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };

  const handleCustomerEditDropDown = (cellData) => {
    let customerOptions = [];
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
    let destinationOptions = [];
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
      listOptions.finishedProductCodes !== undefined &&
      listOptions.finishedProductCodes !== null
    ) {
      if (
        listOptions.finishedProductCodes[cellData.rowData.ShareholderCode] !==
          undefined &&
        Array.isArray(
          listOptions.finishedProductCodes[cellData.rowData.ShareholderCode]
        )
      ) {
        listOptions.finishedProductCodes[
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

  const expanderTemplate = (data) => {
    const open =
      expandedRows.findIndex(
        (item) => item.SequenceNo === data.rowData.SequenceNo
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
        <div className="ui red circular empty label badge  circle-padding" />
      </div>
    ) : (
      <div>
        <span>{data.rowData.AttributeName}</span>
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

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 detailsTable">
              <DataTable
                data={modRailWagonList}
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
              >
                <DataTable.Column
                  className="compColHeight"
                  key="SequenceNo"
                  field="SequenceNo"
                  header={t("RailRouteConfigurationDetails_Sequence")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="TrailerCode"
                  field="TrailerCode"
                  header={t("ViewRailLoadingDetails_RailWagonCode")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="CarrierCompanyCode"
                  field="CarrierCompanyCode"
                  header={t("ViewRailLoadingDetails_CarrierCompany")}
                />
                <DataTable.Column
                  className="compColHeight"
                  key="ShareholderCode"
                  field="ShareholderCode"
                  header={handleIsRequiredCompartmentCell(
                    t("RailDispatchPlanDetail_ShareHolderCode")
                  )}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomEditDropDown(
                      cellData,
                      listOptions.shareholderCodes
                    )
                  }
                />
                {createdFromEntity === 2 ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="ContractCode"
                    field="ContractCode"
                    header={handleIsRequiredCompartmentCell(
                      t("RailDispatchPlanDetail_ContractCode")
                    )}
                    editable={true}
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
                  className="compColHeight"
                  key="FinishedProductCode"
                  field="FinishedProductCode"
                  header={handleIsRequiredCompartmentCell(
                    t("ViewRailDispatchList_FinishedProductCode")
                  )}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleProductEditDropDown(cellData)
                  }
                />
                <DataTable.Column
                  className="compColHeight"
                  key="CustomerCode"
                  field="CustomerCode"
                  header={handleIsRequiredCompartmentCell(
                    t("ViewRailDispatchList_Customer")
                  )}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleCustomerEditDropDown(cellData)
                  }
                />
                <DataTable.Column
                  className="compColHeight"
                  key="DestinationCode"
                  field="DestinationCode"
                  header={handleIsRequiredCompartmentCell(
                    t("ViewRailDispatchList_DestinationCode")
                  )}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(cellData) =>
                    handleDestinationEditDropDown(cellData)
                  }
                />
                {railLookUpData.PlanType === "1" ? (
                  <DataTable.Column
                    className="compColHeight"
                    key="Quantity"
                    field="Quantity"
                    header={handleIsRequiredCompartmentCell(
                      t("RailDispatchPlanDetail_Quantity")
                    )}
                    editable={true}
                    editFieldType="text"
                    renderer={(cellData) => decimalDisplayValues(cellData)}
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
        </div>
      )}
    </TranslationConsumer>
  );
}
