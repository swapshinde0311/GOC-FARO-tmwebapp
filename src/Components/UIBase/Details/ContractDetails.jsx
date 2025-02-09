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
import * as Utilities from "../../../JS/Utilities";
import PropTypes from "prop-types";
import {
  getOptionsWithSelect,
  handleIsRequiredCompartmentCell,
} from "../../../JS/functionalUtilities";
import ErrorBoundary from "../../ErrorBoundary";

ContractDetails.propTypes = {
  contract: PropTypes.object.isRequired,
  modContract: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    contractTypeOptions: PropTypes.array,
    unitOfWeight: PropTypes.array,
    unitOfVolume: PropTypes.array,
    terminalCodes: PropTypes.array,
    carrierOptions: PropTypes.array,
    finishedProductOptions: PropTypes.array,
    customerDestinationOptions: PropTypes.object,
  }).isRequired,
  onDateTextChange: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  selectedPlanRow: PropTypes.array.isRequired,
  modContractItems: PropTypes.array.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddPlan: PropTypes.func.isRequired,
  handleDeletePlan: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  attributeValidationErrors: PropTypes.object.isRequired,
  expandedRows: PropTypes.array.isRequired,
  modAttributeMetaDataList: PropTypes.array.isRequired,
  onAttributeDataChange: PropTypes.func.isRequired,
  handleCompAttributeCellDataEdit: PropTypes.func.isRequired,
  compartmentDetailsPageSize: PropTypes.number.isRequired,
  isEnableForceClose: PropTypes.bool.isRequired,
  handleForceClose: PropTypes.object.isRequired,
  handleViewShipments: PropTypes.func.isRequired,
  handleViewDispatch: PropTypes.func.isRequired,
  isAutoGeneratedContractCode: PropTypes.bool.isRequired,
};

ContractDetails.defaultProps = {
  listOptions: {
    terminalCodes: [],
    contractTypeOptions: [],
    carrierOptions: [],
    unitOfVolume: [],
    unitOfWeight: [],
    finishedProductOptions: [],
    customerDestinationOptions: {},
  },
  modContractItems: [],
  isEnterpriseNode: false,
};
export default function ContractDetails({
  contract,
  modContract,
  onFieldChange,
  validationErrors,
  attributeValidationErrors,
  onDateTextChange,
  listOptions,
  onAllTerminalsChange,
  handleAddPlan,
  handleDeletePlan,
  selectedPlanRow,
  handleRowSelectionChange,
  handleCellDataEdit,
  modContractItems,
  selectedShareholder,
  isEnterpriseNode,
  onAttributeDataChange,
  handleCompAttributeCellDataEdit,
  modAttributeMetaDataList,
  expandedRows,
  toggleExpand,
  compartmentDetailsPageSize,
  isEnableForceClose,
  handleForceClose,
  handleViewShipments,
  handleViewDispatch,
  isAutoGeneratedContractCode,
}) {
  const [t] = useTranslation();

  let customerOptions = [];
  if (listOptions.customerDestinationOptions !== null && Object.keys(listOptions.customerDestinationOptions).length > 0) {
     customerOptions = Utilities.transferListtoOptions(Object.keys(listOptions.customerDestinationOptions)
  );
  }
  

  // const [showShipments, setShowShipments] = useState(false);

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
    let val = modContractItems[cellData.rowIndex][cellData.field];
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

  const handleDateEdit = (cellData) => {
    let val = modContractItems[cellData.rowIndex][cellData.field];
    return (
      // <TranslationConsumer>
      //   {(t) => (
      <DatePicker
        fluid
        value={val === null ? "" : new Date(val)}
        //label={t(`ContractInfo_StartDate`)}
        showYearSelector="true"
        // indicator="required"
        // disablePast={true}
        //type="datetime"
        displayFormat={getCurrentDateFormat()}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        onTextChange={(value, error) => {
          handleCellDataEdit(value, cellData);
        }}
        // error={t(validationErrors.StartDate)}
        reserveSpace={false}
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

    if (cellData.field === "DestinationCode") {
      let destOptions =
        listOptions.customerDestinationOptions[modContract.CustomerCode];
      if (destOptions !== undefined && Array.isArray(destOptions)) {
        dropDownOptions = Utilities.transferListtoOptions(destOptions);
        dropDownOptions = getOptionsWithSelect(
          dropDownOptions,
          t("Common_Select")
        );
      }
    }
    return (
      <Select
        className="selectDropwdown"
        placeholder={t("Common_Select")}
        value={modContractItems[cellData.rowIndex][cellData.field]}
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
    <div className="detailsContainer">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modContract.ContractCode}
            label={t("ContractInfo_ContractCode")}
            indicator="required"
            disabled={
              isAutoGeneratedContractCode ? true : contract.ContractCode !== ""
            }
            onChange={(data) => onFieldChange("ContractCode", data)}
            error={t(validationErrors.ContractCode)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t("Customer_Code")}
            indicator="required"
            value={modContract.CustomerCode}
            options={customerOptions}
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
            value={
              modContract.Description === null ? "" : modContract.Description
            }
            label={t("ContractInfo_Description")}
            onChange={(data) => onFieldChange("Description", data)}
            error={t(validationErrors.Description)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modContract.StartDate === null
                ? ""
                : Utilities.convertStringToCommonDateFormat(
                    modContract.StartDate
                  )
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`ContractInfo_StartDate`)}
            showYearSelector="true"
            indicator="required"
            //type="datetime"
            disablePast={true}
            onChange={(data) => onFieldChange("StartDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("StartDate", value, error);
            }}
            error={t(validationErrors.StartDate)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <DatePicker
            fluid
            value={
              modContract.EndDate === null
                ? ""
                : Utilities.convertStringToCommonDateFormat(modContract.EndDate)
            }
            displayFormat={getCurrentDateFormat()}
            label={t(`ContractInfo_EndDate`)}
            showYearSelector="true"
            indicator="required"
            //type="datetime"
            disablePast={true}
            onChange={(data) => onFieldChange("EndDate", data)}
            onTextChange={(value, error) => {
              onDateTextChange("EndDate", value, error);
            }}
            error={t(validationErrors.EndDate)}
            reserveSpace={false}
          />
        </div>

        {/* <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_Select")}
            label={t("ContractInfo_ContractType")}
            value={getKeyByValue(
              Constants.contractType,
              modContract.ContractType
            )}
            options={listOptions.contractTypeOptions}
            disabled={true}
          // onChange={(data) => onFieldChange("Active", data)}
          />
        </div> */}

        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={
              getKeyByValue(Constants.contractStatus, modContract.Status) ===
              undefined
                ? ""
                : getKeyByValue(Constants.contractStatus, modContract.Status)
            }
            label={t("ContractInfo_Status")}
            disabled={true}
            //onChange={(data) => onFieldChange("Description", data)}
            //error={t(validationErrors.Description)}
            reserveSpace={false}
          />
        </div>
        {/* <div className="col-12 col-md-6 col-lg-4">
          <Select
            fluid
            placeholder={t("Common_All")}
            //className="maxHeight"
            // style={{ maxHeight: "20px!important" }}
            label={t("ContractInfo_AssociatedCarrier")}
            value={modContract.CarrierCollection}
            options={listOptions.carrierOptions}
            multiple={true}
            onChange={(data) => onFieldChange("CarrierCollection", data)}
            error={t(validationErrors.CarrierCollection)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
            // onChange={(data) => onFieldChange("Active", data)}
          />
        </div> */}

        {isEnterpriseNode ? (
          <div className="col-12 col-md-6 col-lg-4">
            <AssociatedTerminals
              terminalList={listOptions.terminalCodes}
              selectedTerminal={modContract.TerminalCodes}
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
            label={t("ShipmentContract_Status")}
            value={modContract.Active}
            options={[
              { text: t("ViewShipment_Ok"), value: true },
              { text: t("ViewShipmentStatus_Inactive"), value: false },
            ]}
            onChange={(data) => onFieldChange("Active", data)}
            disabled={contract.ContractCode === "" ? true : false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <Input
            fluid
            value={modContract.Remarks === null ? "" : modContract.Remarks}
            label={t("ShipmentOrder_Remarks")}
            onChange={(data) => onFieldChange("Remarks", data)}
            indicator={modContract.Active !== contract.Active ? "required" : ""}
            error={t(validationErrors.Remarks)}
            reserveSpace={false}
          />
        </div>

        <div className="col-12 col-md-12 col-lg-12">
          <Select
            fluid
            placeholder={t("Common_All")}
            //className="maxHeight"
            // style={{ maxHeight: "20px!important" }}
            label={t("ContractInfo_AssociatedCarrier")}
            value={modContract.CarrierCollection}
            options={listOptions.carrierOptions}
            multiple={true}
            onChange={(data) => onFieldChange("CarrierCollection", data)}
            error={t(validationErrors.CarrierCollection)}
            reserveSpace={false}
            search={true}
            noResultsMessage={t("noResultsMessage")}
            // onChange={(data) => onFieldChange("Active", data)}
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
          <h4>{t("ContractInfo_Details")}</h4>
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
            data={modContractItems}
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
                t("ContractInfo_Product")
              )}
              // rowHeader={true}
              editable={true}
              editFieldType="text"
              customEditRenderer={handleDropdownEdit}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="DestinationCode"
              field="DestinationCode"
              header={t("ContractInfo_Destination")}
              // rowHeader={true}
              editable={true}
              editFieldType="text"
              customEditRenderer={handleDropdownEdit}
            ></DataTable.Column>
            <DataTable.Column
              className="compColHeight colminWidth"
              key="StartDate"
              field="StartDate"
              header={t("ContractInfo_StartDate")}
              // rowHeader={true}
              editable={true}
              editFieldType="text"
              renderer={(cellData) =>
                cellData.value === null
                  ? ""
                  : new Date(cellData.value).toLocaleDateString()
              }
              customEditRenderer={handleDateEdit}
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight colminWidth"
              key="EndDate"
              field="EndDate"
              header={t("ContractInfo_EndDate")}
              // rowHeader={true}
              editable={true}
              editFieldType="text"
              renderer={(cellData) =>
                cellData.value === null
                  ? ""
                  : new Date(cellData.value).toLocaleDateString()
              }
              // renderer={(cellData) =>
              //   cellData.value === null
              //     ? ""
              //     : new Date(cellData.value).toLocaleDateString() +
              //       " " +
              //       new Date(cellData.value).toLocaleTimeString()
              // }
              customEditRenderer={handleDateEdit}
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight colminWidth"
              key="Quantity"
              field="Quantity"
              header={handleIsRequiredCompartmentCell(
                t("ContractInfo_Quantity")
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
              //rowHeader={true}
              editable={true}
              editFieldType="text"
              customEditRenderer={handleDropdownEdit}
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight disabledColumn colminWidth"
              key="BlockedQuantity"
              field="BlockedQuantity"
              header={t("ContractInfo_BlockedQuantity")}
              // rowHeader={true}
              renderer={(cellData) =>
                cellData.value === null ? "0" : cellData.value.toLocaleString()
              }
              editFieldType="text"
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight disabledColumn colminWidth"
              key="LoadedQuantity"
              field="LoadedQuantity"
              header={t("ContractInfo_LoadedQty")}
              // rowHeader={true}
              renderer={(cellData) =>
                cellData.value === null ? "0" : cellData.value.toLocaleString()
              }
              editFieldType="text"
            ></DataTable.Column>

            <DataTable.Column
              className="compColHeight disabledColumn colminWidth"
              key="ReaminingQuantity"
              field="RemainingQuantity"
              header={t("ContractInfo_RemQuantity")}
              // rowHeader={true}
              renderer={(cellData) =>
                cellData.value === null ? "0" : cellData.value.toLocaleString()
              }
              editFieldType="text"
            ></DataTable.Column>
            <DataTable.Column
              className="expandedColumn"
              initialWidth="175px"
              renderer={expanderTemplate}
            />
          </DataTable>
        </div>
      </div>

      {/* {contract.ContractCode !== "" &&
        contract.TransportationType === Constants.TransportationType.ROAD ? (
        <div className="row">
          <div className="col-12">
            <Accordion>
              <Accordion.Content
                title={t("ShipmentOrder_ViewShipments")}
                active={showShipments}
                onClick={() => setShowShipments(!showShipments)}
              >
                <div className="borderTable">
                  <TruckShipmentProject
                    shipmentSource={Constants.shipmentFrom.Contract}
                    shipmentSourceCode={modContract.ContractCode}
                      selectedShareholder={selectedShareholder}
                      shipmentSourceCompartmentItems={modContractItems}
                      shipmentSourceDetails={modContract}
                  />
                </div>
              </Accordion.Content>
            </Accordion>
          </div>
        </div>
      ) : (
        ""
      )}
      {contract.ContractCode !== "" &&
        contract.TransportationType === Constants.TransportationType.RAIL ? (
        <div className="row">
          <div className="col-12">
            <Accordion>
              <Accordion.Content
                title={t("ViewRailDispatchList_RailShipments")}
                active={showShipments}
                onClick={() => setShowShipments(!showShipments)}
              >
                <div className="borderTable">
                  <RailDispatchProject
                    shipmentSource={2}
                    shipmentSourceCode={modContract.ContractCode}
                      selectedShareholder={selectedShareholder}
                      shipmentSourceCompartmentItems={modContractItems}
                      shipmentSourceDetails={modContract}
                  />
                </div>
              </Accordion.Content>
            </Accordion>
          </div>
        </div>
      ) : (
        ""
      )} */}

      <div className="row">
        <div
          className="col col-md-8 col-lg-9 col col-xl-12"
          style={{ textAlign: "right" }}
        >
          <Button
            type="primary"
            onClick={handleForceClose}
            disabled={!isEnableForceClose}
            content={t("ShipmentOrder_BtnForceClose")}
          ></Button>
          {contract.ContractCode !== "" &&
          contract.TransportationType === Constants.TransportationType.ROAD ? (
            <Button
              content={t("ShipmentOrder_ViewShipments")}
              onClick={handleViewShipments}
            ></Button>
          ) : null}
          {contract.ContractCode !== "" &&
          contract.TransportationType === Constants.TransportationType.RAIL ? (
            <Button
              content={t("DispatchContract_ViewDispatch")}
              onClick={handleViewDispatch}
            ></Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
