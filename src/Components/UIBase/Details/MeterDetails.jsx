import React from 'react';
import { Accordion, Select, Input } from '@scuf/common';
import { useTranslation } from "@scuf/localization";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";


export default function MeterDetails({
    meter,
    LABlendType,
    modMeter,
    listOptions,
    validationErrors,
    onFieldChange,
    onActiveStatusChange,
    meterLineType,
    attributeValidationErrors,
    modAttributeMetaDataList,
    onAttributeDataChange,
    isTransloading,
    source
}) {
    const [t] = useTranslation();

    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }


    return (
        <div className="detailsContainer">
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modMeter.Code}
                        label={t("Meter_Code")}
                        indicator="required"
                        disabled={meter.Code !== ""}
                        onChange={(data) => onFieldChange("Code", data)}
                        error={t(validationErrors.Code)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modMeter.Name}
                        label={t("Meter_Name")}
                        indicator="required"
                        onChange={(data) => onFieldChange("Name", data)}
                        error={t(validationErrors.Name)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder="Select"
                        label={t("Meter_Type")}
                        value={modMeter.MeterType}
                        disabled={(LABlendType === "NONE" && meterLineType === "MAINLINE") || meterLineType !== "MAINLINE" || meter.Code !== "" ? true : false}
                        indicator="required"
                        options={source === "PipelineSiteView" ? listOptions.pipelineTypeOptions : meterLineType === "MAINLINE" ? listOptions.mainlineTypeOptions : listOptions.additiveTypeOptions}
                        onChange={(data) => onFieldChange("MeterType", data)}
                        reserveSpace={false}
                        search={false}
                        noResultsMessage={t("noResultsMessage")}
                    />
                </div>

                {meterLineType === "ADDITIVE" ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Select
                            fluid
                            placeholder="Select"
                            label={t("Meter_AssociatedProdMeterCode")}
                            value={modMeter.ConjunctionNumber != null ? modMeter.ConjunctionNumber.toString() : ""}
                            indicator="required"
                            options={listOptions.meterCodeOptions}
                            onChange={(data) => onFieldChange("ConjunctionNumber", data)}
                            error={t(validationErrors.ConjunctionNumber)}
                            reserveSpace={false}
                        />
                    </div> : ("")}

                {meterLineType === "MAINLINE" ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Input
                            fluid
                            value={modMeter.MeterNumber}
                            label={t("Meter_BCUMeterRefNumber")}
                            indicator="required"
                            disabled={meter.Code !== ""}
                            onChange={(data) => onFieldChange("MeterNumber", data)}
                            reserveSpace={false}
                            error={t(validationErrors.MeterNumber)}
                        /> </div> :
                    source !== "PipelineSiteView" ?
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modMeter.MeterNumber}
                                label={t("Meter_BCUInjectorPosNo")}
                                indicator="required"
                                disabled={meter.Code !== ""}
                                onChange={(data) => onFieldChange("MeterNumber", data)}
                                reserveSpace={false}
                                error={t(validationErrors.MeterNumber)}
                            /> </div> : null}

                {meterLineType === "MAINLINE" && LABlendType === "SIDE_STREAM" && modMeter.MeterType !== "FINISHED_PRODUCT_METER" ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Select
                            fluid
                            placeholder="Select"
                            label={t("Meter_FPNumber")}
                            value={modMeter.ConjunctionNumber != null ? modMeter.ConjunctionNumber.toString() : ""}
                            indicator="required"
                            options={listOptions.FpMeterCodes}
                            onChange={(data) => onFieldChange("ConjunctionNumber", data)}
                            error={t(validationErrors.ConjunctionNumber)}
                            reserveSpace={false}
                        />
                    </div> : ("")}


                {isTransloading ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Select
                            fluid
                            placeholder="Select"
                            label={t("BaseProductList_Title")}
                            value={modMeter.BaseproductList}
                            options={listOptions.baseProductOptions}
                            onChange={(data) => onFieldChange("BaseproductList", data)}
                            multiple={true}
                            reserveSpace={false}
                        />
                    </div>
                    : meterLineType === "MAINLINE" && LABlendType === "SEQUENTIAL" ?
                        <div className="col-12 col-md-6 col-lg-4"><Select
                            fluid
                            placeholder="Select"
                            label={t("Meter_AvlTankGroup")}
                            value={modMeter.TankGroupList}
                            multiple={true}
                            indicator="required"
                            options={listOptions.tankGroupOptions}
                            onChange={(data) => onFieldChange("TankGroupList", data)}
                            error={t(validationErrors.TankGroupCode)}
                            noResultsMessage={t("noResultsMessage")}
                            reserveSpace={false}
                            search={true}
                        /></div>
                        : modMeter.MeterType !== "FINISHED_PRODUCT_METER" && source !== "PipelineSiteView" ?
                            <div className="col-12 col-md-6 col-lg-4"><Select
                                fluid
                                placeholder="Select"
                                label={t("Meter_AvlTankGroup")}
                                value={modMeter.TankGroupCode}
                                indicator="required"
                                options={listOptions.tankGroupOptions}
                                onChange={(data) => onFieldChange("TankGroupCode", data)}
                                error={t(validationErrors.TankGroupCode)}
                                noResultsMessage={t("noResultsMessage")}
                                reserveSpace={false}
                                search={true}
                            /></div>
                            : null}

                {source !== "PipelineSiteView" ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Input
                            fluid
                            label={t("Meter_ProductDensity")}
                            value={modMeter.ProductDensityInput}
                            onChange={(data) => onFieldChange("ProductDensityInput", data)}
                            error={t(validationErrors.ProductDensityInput)}
                            reserveSpace={false}
                        />
                    </div> : null}
                {source !== "PipelineSiteView" ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Input
                            fluid
                            value={
                                modMeter.Description === null
                                    ? ""
                                    : modMeter.Description
                            }
                            label={t("FinishedProductList_Description")}
                            onChange={(data) => onFieldChange("Description", data)}
                            error={t(validationErrors.Description)}
                            reserveSpace={false}
                        />
                    </div> : null}
                {source === "PipelineSiteView" ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Select
                            fluid
                            placeholder="Select"
                            label={t("Meter_BaseUOM")}
                            value={modMeter.MeterBaseUOM != null ? modMeter.MeterBaseUOM.toString() : ""}
                            indicator="required"
                            disabled={meter.Code !== ""}
                            options={listOptions.MeterBaseUOMs}
                            onChange={(data) => onFieldChange("MeterBaseUOM", data)}
                            error={t(validationErrors.MeterBaseUOM)}
                            reserveSpace={false}
                        />
                    </div> : ("")}
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder={t("FinishedProductInfo_Select")}
                        label={t("Cust_Status")}
                        value={modMeter.Active}
                        options={[
                            { text: t("ViewShipment_Ok"), value: true },
                            { text: t("ViewShipmentStatus_Inactive"), value: false },
                        ]}
                        onChange={(data) => onActiveStatusChange(data)}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={
                            modMeter.Remarks === null ? "" : modMeter.Remarks
                        }
                        label={t("Cust_Remarks")}
                        onChange={(data) => onFieldChange("Remarks", data)}
                        indicator={
                            modMeter.Active !== meter.Active ? "required" : ""
                        }
                        error={t(validationErrors.Remarks)}
                        reserveSpace={false}
                    />
                </div>
            </div>
            {
                modAttributeMetaDataList.length > 0 ?
                modAttributeMetaDataList.map((attire) =>
                        <div className='bayAccordian'>
                            <ErrorBoundary>
                                <Accordion className=''>
                                    <Accordion.Content
                                        // className="attributeAccordian"
                                        title={t("Attributes_Header")}
                                    >
                                        <AttributeDetails
                                            selectedAttributeList={attire.attributeMetaDataList}
                                            handleCellDataEdit={onAttributeDataChange}
                                            attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attire.TerminalCode)}
                                        ></AttributeDetails>
                                    </Accordion.Content>
                                </Accordion>
                            </ErrorBoundary>
                        </div>
                    ) : null

            }
        </div >
    );
}

