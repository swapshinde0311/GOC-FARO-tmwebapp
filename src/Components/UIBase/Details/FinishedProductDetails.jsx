import React from "react";
import {
  Accordion,
  Select,
  Input,
  Icon,
  Checkbox,
  Button,
  ColorPicker,
  Radio,
} from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";

FinishedProductDetails.propTypes = {
  finishedProduct: PropTypes.object.isRequired,
  modFinishedProduct: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  additiveDetails: PropTypes.object.isRequired,
  baseProductDetails: PropTypes.object.isRequired,
  selectedColor: PropTypes.object,
  listOptions: PropTypes.shape({
    productTypeOptions: PropTypes.array,
    densityUOMOptions: PropTypes.array,
    volumeUOMOptions: PropTypes.array,
    terminalCodes: PropTypes.array,
    prodFamilyOptions: PropTypes.array,
    hazardousProductCategoryOptions: PropTypes.array,
  }).isRequired,
  modAssociations: PropTypes.array.isRequired,
  expandedRows: PropTypes.array.isRequired,
  selectedAssociationRows: PropTypes.array.isRequired,
  onColorPickerChange: PropTypes.func.isRequired,
  onColorPickerClose: PropTypes.func.isRequired,
  onApplyColor: PropTypes.func.isRequired,
  onChangeColor: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  handleAddAdditive: PropTypes.func.isRequired,
  handleDeleteAdditive: PropTypes.func.isRequired,
  handleRowSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  bindAdditives: PropTypes.func.isRequired,
  onActiveStatusChange: PropTypes.func.isRequired,
  onHexValueChange: PropTypes.func.isRequired,
  colorPickerState: PropTypes.bool,
  isValidHex: PropTypes.bool.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  isDCHEnabled: PropTypes.bool.isRequired,
  isValidShareholderSysExtCode: PropTypes.bool.isRequired,
  hazardousEnabled: PropTypes.bool,
};

FinishedProductDetails.defaultProps = {
  listOptions: {
    productTypeOptions: [],
    densityUOMOptions: [],
    volumeUOMOptions: [],
    terminalCodes: [],
    prodFamilyOptions: [],
    hazardousProductCategoryOptions: [],
  },
  modAssociations: [],
  isEnterpriseNode: false,
  isDCHEnabled: false,
  isValidShareholderSysExtCode: false,
  hazardousEnabled: false,
};

export default function FinishedProductDetails({
  finishedProduct,
  modFinishedProduct,
  validationErrors,
  additiveDetails,
  baseProductDetails,
  selectedColor,
  listOptions,
  modAssociations,
  expandedRows,
  selectedAssociationRows,
  onColorPickerChange,
  onColorPickerClose,
  onApplyColor,
  onChangeColor,
  toggleExpand,
  handleAddAssociation,
  handleDeleteAssociation,
  handleAddAdditive,
  handleDeleteAdditive,
  handleRowSelectionChange,
  handleCellDataEdit,
  onFieldChange,
  onAllTerminalsChange,
  onActiveStatusChange,
  colorPickerState,
  onHexValueChange,
  isValidHex,
  isEnterpriseNode,
  isDCHEnabled,
  isValidShareholderSysExtCode,
  modAttributeMetaDataList,
  attributeValidationErrors,
  onAttributeDataChange,
  hazardousEnabled,
}) {
  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };
  const [t] = useTranslation();
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
        <span>{open ? t("Hide_Additives") : t("View_Additives")}</span>
        <Icon
          root="common"
          name={open ? "caret-up" : "caret-down"}
          className="margin_l10"
        />
      </div>
    );
  };

  const deleteAdditive = (data) => {
    return (
      <div
        onClick={() => handleDeleteAdditive(data.rowData)}
        className="compartmentIcon gridButtonFontColor"
      >
        <span>{t("FinishedProductList_Delete")}</span>
        <Icon root="common" name="delete" className="margin_l10" />
      </div>
    );
  };

  function rowExpansionTemplate(data) {
    return Array.isArray(data.addtiveAssociations) &&
      data.addtiveAssociations.length > 0 ? (
      <div className="childTable ChildGridViewAllShipmentLoadingDetails">
        <DataTable data={data.addtiveAssociations}>
          <DataTable.Column
            className="expandedchildColumn"
            initialWidth="10px"
          />
          <DataTable.Column
            className="compColHeight"
            key="AdditiveCode"
            field="AdditiveCode"
            header={t("UnmatchedLocalTrans_Additive")}
            editable={true}
            editFieldType="text"
            customEditRenderer={handleAdvDropdownEdit}
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            key="Quantity"
            field="Quantity"
            header={t("FinishedProductInfo_Quantity")}
            editable={true}
            editFieldType="text"
            customEditRenderer={handleCustomEditTextBox}
          ></DataTable.Column>
          <DataTable.Column
            className="compColHeight"
            initialWidth="200px"
            header={
              <div
                onClick={() => handleAddAdditive(data)}
                className="compartmentIcon gridButtonFontColor"
              >
                <span>{t("FinishedProduct_Add_Additive")}</span>
                <Icon
                  root="common"
                  name="badge-plus"
                  size="small"
                  className="margin_l10"
                />
              </div>
            }
            //header={editableTemplate}
            renderer={deleteAdditive}
          />
        </DataTable>
      </div>
    ) : (
      <div className="compartmentIcon">
        <div className="gridButtonAlignLeft">
          {t("CustomerInventory_NoRecordsFound")}
        </div>
        <div
          onClick={() => handleAddAdditive(data)}
          className="gridButtonFontColor"
        >
          <span>{t("FinishedProduct_Add_Additive")}</span>
          <Icon
            root="common"
            name="badge-plus"
            size="small"
            className="margin_l10 margin_r30"
          />
        </div>
      </div>
    );
  }

  const handleBPDropdownEdit = (cellData) => {
    let dropDownOptions = [];
    if (modFinishedProduct.ProductType === "ALLPROD") {
      Object.keys(baseProductDetails).forEach((prodType) => {
        if (
          baseProductDetails[prodType] !== undefined &&
          Array.isArray(baseProductDetails[prodType])
        ) {
          baseProductDetails[prodType].forEach((baseProduct) =>
            dropDownOptions.push({ text: baseProduct, value: baseProduct })
          );
        }
      });
    } else {
      if (
        baseProductDetails[modFinishedProduct.ProductType] !== undefined &&
        Array.isArray(baseProductDetails[modFinishedProduct.ProductType])
      ) {
        baseProductDetails[modFinishedProduct.ProductType].forEach(
          (baseProduct) =>
            dropDownOptions.push({ text: baseProduct, value: baseProduct })
        );
      }
      if (
        baseProductDetails["ALLPROD"] !== undefined &&
        Array.isArray(baseProductDetails["ALLPROD"])
      ) {
        baseProductDetails["ALLPROD"].forEach((baseProduct) =>
          dropDownOptions.push({ text: baseProduct, value: baseProduct })
        );
      }
    }
    return (
      <Select
        className="selectDropwdown"
        placeholder="Select"
        value={modAssociations[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownOptions}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
      />
    );
  };

  const handleAdvDropdownEdit = (cellData) => {
    try {
      let dropDownOptions = [];
      let bpIndex = 0;
      bpIndex = modAssociations.findIndex(
        (item) => item.SeqNumber === cellData.rowData.baseSeqNumber
      );
      let bPProdType = "";
      // Finding the ProdType of the BaseProduct
      Object.keys(baseProductDetails).forEach((prodType) => {
        let prodIndex = baseProductDetails[prodType].findIndex(
          (bp) => bp === cellData.rowData.BaseProductCode
        );
        if (prodIndex >= 0) {
          bPProdType = prodType;
        }
      });

      if (bPProdType === "ALLPROD") {
        if (modFinishedProduct.ProductType === "ALLPROD") {
          Object.keys(additiveDetails).forEach((prodType) => {
            if (
              additiveDetails[prodType] !== undefined &&
              Array.isArray(additiveDetails[prodType])
            ) {
              additiveDetails[prodType].forEach((advProduct) =>
                dropDownOptions.push({ text: advProduct, value: advProduct })
              );
            }
          });
        } else {
          if (
            additiveDetails[modFinishedProduct.ProductType] !== undefined &&
            Array.isArray(additiveDetails[modFinishedProduct.ProductType])
          ) {
            additiveDetails[modFinishedProduct.ProductType].forEach(
              (advProduct) =>
                dropDownOptions.push({ text: advProduct, value: advProduct })
            );
          }
          if (
            additiveDetails["ALLPROD"] !== undefined &&
            Array.isArray(additiveDetails["ALLPROD"])
          ) {
            additiveDetails["ALLPROD"].forEach((advProduct) =>
              dropDownOptions.push({ text: advProduct, value: advProduct })
            );
          }
        }
      } else {
        if (
          additiveDetails[bPProdType] !== undefined &&
          Array.isArray(additiveDetails[bPProdType])
        ) {
          additiveDetails[bPProdType].forEach((advProduct) =>
            dropDownOptions.push({ text: advProduct, value: advProduct })
          );
        }
        if (
          additiveDetails["ALLPROD"] !== undefined &&
          Array.isArray(additiveDetails["ALLPROD"])
        ) {
          additiveDetails["ALLPROD"].forEach((advProduct) =>
            dropDownOptions.push({ text: advProduct, value: advProduct })
          );
        }
      }
      return (
        <Select
          className="selectDropwdown"
          placeholder="Select"
          value={
            modAssociations[bpIndex].addtiveAssociations[cellData.rowIndex][
              cellData.field
            ]
          }
          fluid
          options={dropDownOptions}
          onChange={(value) => handleCellDataEdit(value, cellData)}
          indicator="required"
          reserveSpace={false}
          search={true}
        />
      );
    } catch (error) {
      console.log(
        "FinishedProductDetails:Error occured on handleAdvDropdownEdit",
        error
      );
    }
  };

  const handleCustomEditTextBox = (cellData) => {
    let bpIndex = 0;
    if (cellData.rowData.AdditiveCode !== null) {
      bpIndex = modAssociations.findIndex(
        (item) => item.BaseProductCode === cellData.rowData.BaseProductCode
      );
    }
    return (
      <Input
        fluid
        value={
          cellData.rowData.AdditiveCode === null
            ? modAssociations[cellData.rowIndex][cellData.field]
            : modAssociations[bpIndex].addtiveAssociations[cellData.rowIndex][
                cellData.field
              ]
        }
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
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
                value={modFinishedProduct.Code}
                indicator="required"
                disabled={finishedProduct.Code !== ""}
                onChange={(data) => onFieldChange("Code", data)}
                label={t("FinishedProductList_Code")}
                error={t(validationErrors.Code)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modFinishedProduct.Name}
                onChange={(data) => onFieldChange("Name", data)}
                indicator="required"
                label={t("FinishedProductList_Name")}
                error={t(validationErrors.Name)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modFinishedProduct.AliasName === null
                    ? ""
                    : modFinishedProduct.AliasName
                }
                onChange={(data) => onFieldChange("AliasName", data)}
                label={t("FinishedProductList_AliasName")}
                reserveSpace={false}
                error={t(validationErrors.AliasName)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("FinishedProductList_ProductType")}
                value={modFinishedProduct.ProductType}
                options={listOptions.productTypeOptions}
                onChange={(data) => onFieldChange("ProductType", data)}
                indicator="required"
                error={t(validationErrors.ProductType)}
                reserveSpace={false}
                search={false}
                noResultsMessage={t("noResultsMessage")}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                className={`color-picker-input ${
                  selectedColor && selectedColor !== "#ffffff"
                    ? "color-selected"
                    : ""
                }`}
                label={t("FinishedProdut_colorCode")}
                onFocus={() => onColorPickerChange()}
                value={
                  modFinishedProduct.Color === null
                    ? ""
                    : modFinishedProduct.Color
                }
                style={{ backgroundColor: selectedColor }}
                reserveSpace={false}
                error={isValidHex ? "" : t(validationErrors.Color)}
                onChange={(color) => onHexValueChange(color)}
              />

              {colorPickerState ? (
                <>
                  <ColorPicker
                    onApply={() => onApplyColor({ hex: selectedColor })}
                    onChange={(color) => onChangeColor(color)}
                    value={selectedColor}
                  />
                  <Button
                    type="primary"
                    iconRoot="common"
                    icon="close"
                    className="color-picker-close"
                    content=""
                    onClick={() => onColorPickerClose()}
                    iconPosition="left"
                  />
                </>
              ) : (
                ""
              )}
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modFinishedProduct.Description === null
                    ? ""
                    : modFinishedProduct.Description
                }
                onChange={(data) => onFieldChange("Description", data)}
                label={t("FinishedProductList_Description")}
                reserveSpace={false}
                error={t(validationErrors.Description)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4 checkboxSelect">
              <Checkbox
                label={t("BaseProductInfo_ExportGrade")}
                checked={modFinishedProduct.ExportGrade}
                disabled={false}
                onChange={(data) => onFieldChange("ExportGrade", data)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <Input
                    fluid
                    value={
                      modFinishedProduct.Density === null
                        ? ""
                        : modFinishedProduct.Density.toLocaleString()
                    }
                    disabled={modFinishedProduct.ExportGrade ? false : true}
                    indicator={modFinishedProduct.ExportGrade ? "required" : ""}
                    onChange={(data) => onFieldChange("Density", data)}
                    label={t("BaseProductInfo_Density")}
                    error={
                      modFinishedProduct.ExportGrade
                        ? t(validationErrors.Density)
                        : ""
                    }
                    reserveSpace={false}
                  />
                </div>{" "}
                <div style={{ width: "48%" }}>
                  <Select
                    fluid
                    placeholder={t("Common_Select")}
                    label={t("BaseProductInfox_UOM")}
                    value={modFinishedProduct.DensityUOM}
                    options={listOptions.densityUOMOptions}
                    disabled={modFinishedProduct.ExportGrade ? false : true}
                    onChange={(data) => onFieldChange("DensityUOM", data)}
                    indicator={modFinishedProduct.ExportGrade ? "required" : ""}
                    reserveSpace={false}
                    search={true}
                    noResultsMessage={t("noResultsMessage")}
                    error={
                      modFinishedProduct.ExportGrade
                        ? t(validationErrors.DensityUOM)
                        : ""
                    }
                  />
                </div>
              </div>
            </div>

            {isDCHEnabled && isValidShareholderSysExtCode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("FP_ProdFamily")}
                  value={modFinishedProduct.ProductFamilyCode}
                  options={listOptions.prodFamilyOptions}
                  onChange={(data) => onFieldChange("ProductFamilyCode", data)}
                  indicator="required"
                  reserveSpace={false}
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                  error={t(validationErrors.ProductFamilyCode)}
                />
              </div>
            ) : (
              ""
            )}
            {hazardousEnabled ? (
              <div className="col-12 col-md-6 col-lg-4">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ width: "48%" }}>
                    <Select
                      fluid
                      placeholder={t("Common_Select")}
                      label={t("FP_HazardousCategory")}
                      value={
                        modFinishedProduct.HazardousCategory === null
                          ? ""
                          : modFinishedProduct.HazardousCategory
                      }
                      options={getOptionsWithSelect(
                        listOptions.hazardousProductCategoryOptions,
                        t("Common_Select")
                      )}
                      onChange={(data) =>
                        onFieldChange("HazardousCategory", data)
                      }
                      reserveSpace={false}
                      search={true}
                      noResultsMessage={t("noResultsMessage")}
                      error={t(validationErrors.HazardousCategory)}
                    />
                  </div>
                  <div style={{ width: "48%" }}>
                    <Input
                      // placeholder="Input"
                      fluid
                      label={t("FP_SFLPercentage")}
                      value={
                        modFinishedProduct.SFLPercent === null
                          ? ""
                          : modFinishedProduct.SFLPercent.toLocaleString()
                      }
                      reserveSpace={false}
                      onChange={(data) => onFieldChange("SFLPercent", data)}
                      error={t(validationErrors.SFLPercent)}
                      indicator={
                        modFinishedProduct.HazardousCategory !== null &&
                        modFinishedProduct.HazardousCategory !== ""
                          ? "required"
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {hazardousEnabled ? (
              <div className="col-12 col-md-6 col-lg-4">
                <Input
                  // placeholder="Input"
                  fluid
                  label={t("FP_HazardousNumber")}
                  value={
                    modFinishedProduct.HazardousNumber === null
                      ? ""
                      : modFinishedProduct.HazardousNumber
                  }
                  reserveSpace={false}
                  onChange={(data) => onFieldChange("HazardousNumber", data)}
                  error={t(validationErrors.HazardousNumber)}
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modFinishedProduct.ToleranceQuantity === null
                    ? ""
                    : modFinishedProduct.ToleranceQuantity.toLocaleString()
                }
                label={t("FinishedProductInfo_ToleranceQuantityRoad")}
                reserveSpace={false}
                onChange={(data) => onFieldChange("ToleranceQuantity", data)}
                error={t(validationErrors.ToleranceQuantity)}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modFinishedProduct.ToleranceQuantityForMarine === null
                    ? ""
                    : modFinishedProduct.ToleranceQuantityForMarine.toLocaleString()
                }
                label={t("FinishedProductInfo_ToleranceQuantityMarine")}
                reserveSpace={false}
                onChange={(data) =>
                  onFieldChange("ToleranceQuantityForMarine", data)
                }
                error={t(validationErrors.ToleranceQuantityForMarine)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modFinishedProduct.ToleranceQuantityForRail === null
                    ? ""
                    : modFinishedProduct.ToleranceQuantityForRail.toLocaleString()
                }
                label={t("FinishedProductInfo_ToleranceQuantityRail")}
                reserveSpace={false}
                onChange={(data) =>
                  onFieldChange("ToleranceQuantityForRail", data)
                }
                error={t(validationErrors.ToleranceQuantityForRail)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modFinishedProduct.ToleranceQuantityForPipeline === null
                    ? ""
                    : modFinishedProduct.ToleranceQuantityForPipeline.toLocaleString()
                }
                label={t("FinishedProductInfo_ToleranceQuantityPipeline")}
                reserveSpace={false}
                onChange={(data) =>
                  onFieldChange("ToleranceQuantityForPipeline", data)
                }
                error={t(validationErrors.ToleranceQuantityForPipeline)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("ProductType_ToleranceQuantityUOM")}
                value={modFinishedProduct.ToleranceQuantityUOM}
                options={listOptions.volumeUOMOptions}
                onChange={(data) => onFieldChange("ToleranceQuantityUOM", data)}
                reserveSpace={false}
                search={true}
                noResultsMessage={t("noResultsMessage")}
                error={t(validationErrors.ToleranceQuantityUOM)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("Cust_Status")}
                value={modFinishedProduct.Active}
                options={[
                  { text: t("ViewShipment_Ok"), value: true },
                  { text: t("ViewShipmentStatus_Inactive"), value: false },
                ]}
                onChange={(data) => onActiveStatusChange(data)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modFinishedProduct.Remarks === null
                    ? ""
                    : modFinishedProduct.Remarks
                }
                label={t("Cust_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                reserveSpace={false}
                indicator={
                  modFinishedProduct.Active !== finishedProduct.Active
                    ? "required"
                    : ""
                }
                error={t(validationErrors.Remarks)}
              />
            </div>

            {isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <AssociatedTerminals
                  terminalList={listOptions.terminalCodes}
                  selectedTerminal={modFinishedProduct.TerminalCodes}
                  error=""
                  onFieldChange={onFieldChange}
                  onCheckChange={onAllTerminalsChange}
                ></AssociatedTerminals>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <p>{t("FP_CaptureLoadingDetails")}</p>
              <Radio
                label={t("ViewMarineUnloadingDetails_BCUCode")}
                checked={
                  modFinishedProduct.WeighBridgeWeighingRequired ? false : true
                }
                onChange={() =>
                  onFieldChange("WeighBridgeWeighingRequired", false)
                }
              />
              <Radio
                label={t("FP_weighBridge")}
                checked={
                  modFinishedProduct.WeighBridgeWeighingRequired ? true : false
                }
                onChange={() =>
                  onFieldChange("WeighBridgeWeighingRequired", true)
                }
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <p>{t("FP_MeasurementType")}</p>
              <Radio
                label={t("LoadType_Volumetric")}
                checked={modFinishedProduct.WeighingRequired ? false : true}
                onChange={() => onFieldChange("WeighingRequired", false)}
                disabled={
                  modFinishedProduct.WeighBridgeWeighingRequired ? true : false
                }
              />
              <Radio
                label={t("FB_weighBased")}
                checked={modFinishedProduct.WeighingRequired ? true : false}
                onChange={() => onFieldChange("WeighingRequired", true)}
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
          <div className="row">
            <div className="col-12 detailsTable havingchildTable">
              <DataTable
                data={modAssociations}
                rowExpansionTemplate={rowExpansionTemplate}
                expandedRows={expandedRows}
                scrollable={true}
                scrollHeight="320px"
                selectionMode="multiple"
                selection={selectedAssociationRows}
                onSelectionChange={handleRowSelectionChange}
              >
                <DataTable.Column
                  className="compColHeight"
                  key="BaseProductCode"
                  field="BaseProductCode"
                  header={t("FinishedProductInfo_BaseProduct")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={handleBPDropdownEdit}
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight"
                  key="Quantity"
                  field="Quantity"
                  header={t("FinishedProductInfo_Quantity")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={handleCustomEditTextBox}
                ></DataTable.Column>
                <DataTable.Column
                  className="expandedColumn"
                  initialWidth="200px"
                  field="BaseProductCode"
                  header={
                    <div className="compartmentIconContainer gridButtonFontColor">
                      <div
                        onClick={handleAddAssociation}
                        className="compartmentIcon"
                      >
                        <div>
                          <h5 className="font14">
                            {t("FinishedProductInfo_Add")}
                          </h5>
                        </div>
                        <div className="margin_l10">
                          <Icon root="common" name="badge-plus" size="small" />
                        </div>
                      </div>
                      <div
                        onClick={handleDeleteAssociation}
                        className="compartmentIcon"
                      >
                        <div className="margin_l10">
                          <h5 className="font14">
                            {t("FinishedProductList_Delete")}
                          </h5>
                        </div>
                        <div className="margin_l10">
                          <Icon root="common" name="delete" size="small" />
                        </div>
                      </div>
                    </div>
                  }
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
