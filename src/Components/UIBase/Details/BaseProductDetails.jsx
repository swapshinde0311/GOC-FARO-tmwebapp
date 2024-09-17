import React from "react";
import { Select, Input, Checkbox, Accordion, Button, ColorPicker } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";

BaseProductDetails.propTypes = {
    baseProduct: PropTypes.object.isRequired,
    modBaseProduct: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    selectedColor: PropTypes.object,
    onFieldChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        productType: PropTypes.array,
        DensityUOM: PropTypes.array,
    }).isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    onAllTerminalsChange: PropTypes.func.isRequired,
    modAttributeMetaDataList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    onAttributeDataChange: PropTypes.func.isRequired,
    onColorPickerChange: PropTypes.func.isRequired,
  onColorPickerClose: PropTypes.func.isRequired,
  onApplyColor: PropTypes.func.isRequired,
  onChangeColor: PropTypes.func.isRequired,
  onHexValueChange: PropTypes.func.isRequired,
  colorPickerState: PropTypes.bool,
  isValidHex: PropTypes.bool.isRequired
}

BaseProductDetails.defaultProps = {
    listOptions: {
        productType: [],
        DensityUOM: [],
    },
    isEnterpriseNode: false
}

export function BaseProductDetails({
    baseProduct,
    modBaseProduct,
    validationErrors,
    selectedColor,
    onFieldChange,
    listOptions,
    onActiveStatusChange,
    isEnterpriseNode,
    onAllTerminalsChange,
    modAttributeMetaDataList,
    attributeValidationErrors,
    onAttributeDataChange,
    onColorPickerChange,
  onColorPickerClose,
  onApplyColor,
  onChangeColor,
  colorPickerState,
  onHexValueChange,
  isValidHex
}) {
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modBaseProduct.Code}
                                indicator="required"
                                disabled={baseProduct.Code !== ""}
                                onChange={(data) => onFieldChange("Code", data)}
                                label={t("BaseProductInfo_BaseProdCode")}
                                error={t(validationErrors.Code)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modBaseProduct.Name}
                                indicator="required"
                                onChange={(data) => onFieldChange("Name", data)}
                                label={t("BaseProductInfo_BaseProdName")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modBaseProduct.Description}
                                label={t("BaseProductInfo_Desc")}
                                onChange={(data) => onFieldChange("Description", data)}
                                error={t(validationErrors.Description)}
                                reserveSpace={false}
                            />
                        </div>
                        
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("BaseProductInfo_DensityUOM")}
                                value={modBaseProduct.DensityUOM}
                                options={listOptions.DensityUOM}
                                onChange={(data) => {
                                    onFieldChange("DensityUOM", data);
                                }}
                                indicator="required"
                                error={t(validationErrors.DensityUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                indicator="required"
                                value={
                                    modBaseProduct.MinDensity === null ? "" : modBaseProduct.MinDensity.toLocaleString()
                                }
                                label={t("BaseProductInfo_MinDensity")}
                                onChange={(data) => onFieldChange("MinDensity", data)}
                                error={t(validationErrors.MinDensity)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                indicator="required"
                                value={
                                    modBaseProduct.MaxDensity === null ? "" : modBaseProduct.MaxDensity.toLocaleString()
                                }
                                label={t("BaseProductInfo_MaxDensity")}
                                onChange={(data) => onFieldChange("MaxDensity", data)}
                                error={t(validationErrors.MaxDensity)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("BaseProductInfo_ProductType")}
                                value={modBaseProduct.ProductType}
                                options={listOptions.productType}
                                onChange={(data) => {
                                    onFieldChange("ProductType", data);
                                }}
                                indicator="required"
                                error={t(validationErrors.ProductType)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modBaseProduct.AliasName}
                                label={t("BaseProductInfo_Alias")}
                                onChange={(data) => onFieldChange("AliasName", data)}
                                error={t(validationErrors.AliasName)}
                                reserveSpace={false}
                            />
                        </div>
                       
                        <div className="col-12 col-md-6 col-lg-4 checkboxSelect">
                            <Checkbox
                                label={t("BaseProductInfo_Additive")}
                                checked={modBaseProduct.IsAdditive ? true : false}
                                onChange={(data) => onFieldChange("IsAdditive", data)}
                                disabled={modBaseProduct.VapourRecoveryProduct === true}
                            />
                            <Checkbox
                                label={t("BaseProductInfo_IsVapRecProd")}
                                checked={modBaseProduct.VapourRecoveryProduct ? true : false}
                                disabled={modBaseProduct.IsAdditive === true}
                                onChange={(data) => onFieldChange("VapourRecoveryProduct", data)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modBaseProduct.HazchemCode}
                                label={t("BaseProductInfo_HazchemCode")}
                                onChange={(data) => onFieldChange("HazchemCode", data)}
                                error={t(validationErrors.HazchemCode)}
                                reserveSpace={false}
                            />
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
              <Input fluid
                className={`color-picker-input ${selectedColor && selectedColor !== '#ffffff' ? 'color-selected' : ''}`}
                label={t("FinishedProdut_colorCode")}
                onFocus={() => onColorPickerChange()}
                value={
                    modBaseProduct.Color === null
                    ? ""
                    : modBaseProduct.Color
                }
                style={{ backgroundColor: selectedColor }}
                reserveSpace={false}
                error={isValidHex ? '' : t(validationErrors.Color)}
                onChange={(color) => onHexValueChange(color)}
              />

              {
                colorPickerState ? <>
                  <ColorPicker
                    onApply={() => onApplyColor({ hex: selectedColor })}
                    onChange={(color) => onChangeColor(color)}
                    value={selectedColor}
                  />
                  <Button type="primary"
                    iconRoot="common"
                    icon="close"
                    className="color-picker-close"
                    content=""
                    onClick={() => onColorPickerClose()}
                    iconPosition="left" /></> : ''
              }

            </div>
            
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("BaseProductList_Status")}
                                value={modBaseProduct.Active}
                                options={[
                                    { text: t("ViewShipment_Ok"), value: true },
                                    { text: t("ViewShipmentStatus_Inactive"), value: false },
                                ]}
                                onChange={(data) => onActiveStatusChange(data)}
                                error={t(validationErrors.Active)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modBaseProduct.Remarks}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                label={t("BaseProductList_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modBaseProduct.Active !== baseProduct.Active ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>
                        
                        {isEnterpriseNode ?
                            (<div className="col-12 col-md-6 col-lg-4">
                                <AssociatedTerminals
                                    terminalList={listOptions.terminalCodes}
                                    selectedTerminal={modBaseProduct.TerminalCodes}
                                    error={t(validationErrors.TerminalCodes)}
                                    onFieldChange={onFieldChange}
                                    onCheckChange={onAllTerminalsChange}
                                ></AssociatedTerminals>
                            </div>) : ("")}
                    </div>

                    {
                        modAttributeMetaDataList.length > 0 ?
                        modAttributeMetaDataList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion >
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={onAttributeDataChange}
                                                attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attribute.TerminalCode)}
                                            ></AttributeDetails>
                                        </Accordion.Content>
                                    </Accordion>
                                </ErrorBoundary>
                            ) : null
                    }
                </div>
            )}
        </TranslationConsumer>
    )
}