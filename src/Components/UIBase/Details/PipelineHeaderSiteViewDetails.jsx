import React from 'react';
import { Select, Input, Accordion } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";



PipelineHeaderSiteViewDetails.propTypes = {
    pipelineHeader: PropTypes.object.isRequired,
    modPipelineHeader: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        pipelineHeaderTypeOptions: PropTypes.array,
        volumeUOMOptions: PropTypes.array,
        lengthUOMOptions: PropTypes.array,
        pipelineMeterList: PropTypes.array,
    }).isRequired,
    modAttributeMetaDataList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    onAttributeDataChange: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
}
PipelineHeaderSiteViewDetails.defaultProps = {
    listOptions: {
        pipelineHeaderTypeOptions: [],
        volumeUOMOptions: [],
        lengthUOMOptions: [],
        pipelineMeterList: []
    },

}

export function PipelineHeaderSiteViewDetails({
    pipelineHeader,
    modPipelineHeader,
    validationErrors,
    onFieldChange,
    onActiveStatusChange,
    listOptions,
    modAttributeMetaDataList,
    attributeValidationErrors,
    onAttributeDataChange,
    isEnterpriseNode
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
                                value={modPipelineHeader.Code}
                                indicator="required"
                                disabled={pipelineHeader.Code !== ""}
                                onChange={(data) => onFieldChange("Code", data)}
                                label={t("PipeLineHeaderInfo_Code")}
                                error={t(validationErrors.Code)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineHeader.Name}
                                indicator="required"
                                onChange={(data) => onFieldChange("Name", data)}
                                label={t("PipeLineHeaderInfo_Name")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modPipelineHeader.PipelineHeaderType}
                                label={t("PipeLineHeaderInfo_Type")}
                                indicator="required"
                                options={listOptions.pipelineHeaderTypeOptions}
                                onChange={(data) => {
                                    onFieldChange("PipelineHeaderType", data);
                                }}
                                error={t(validationErrors.PipelineHeaderType)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineHeader.PointName}
                                onChange={(data) => onFieldChange("PointName", data)}
                                indicator="required"
                                label={t("PipeLineHeaderInfo_PointName")}
                                error={t(validationErrors.PointName)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineHeader.OuterDiameter}
                                onChange={(data) => onFieldChange("OuterDiameter", data)}
                                label={t("PipeLineHeaderInfo_OuterDiameter")}
                                error={t(validationErrors.OuterDiameter)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                indicator={((modPipelineHeader.OuterDiameter !== null && modPipelineHeader.OuterDiameter !== "")) ? "required" : ""}
                                value={modPipelineHeader.OuterDiameterUOM}
                                label={t("PipeLineHeaderInfo_OuterDiameterUOM")}
                                options={listOptions.lengthUOMOptions}
                                onChange={(data) => {
                                    onFieldChange("OuterDiameterUOM", data);
                                }}
                                error={t(validationErrors.OuterDiameterUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineHeader.WallThickness}
                                onChange={(data) => onFieldChange("WallThickness", data)}
                                label={t("PipeLineHeaderInfo_PipeThickness")}
                                error={t(validationErrors.WallThickness)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modPipelineHeader.WallThicknessUOM}
                                indicator={((modPipelineHeader.WallThickness !== null && modPipelineHeader.WallThickness !== "")) ? "required" : ""}
                                label={t("PipeLineHeaderInfo_PipeThicknessUOM")}
                                options={listOptions.lengthUOMOptions}
                                onChange={(data) => {
                                    onFieldChange("WallThicknessUOM", data);
                                }}
                                error={t(validationErrors.WallThicknessUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modPipelineHeader.TypicalFlowRatePerHour}
                                onChange={(data) => onFieldChange("TypicalFlowRatePerHour", data)}
                                label={t("PipeLineHeaderInfo_ProductFlowRate")}
                                error={t(validationErrors.TypicalFlowRatePerHour)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modPipelineHeader.FlowRateUOM}
                                indicator={((modPipelineHeader.TypicalFlowRatePerHour !== null && modPipelineHeader.TypicalFlowRatePerHour !== "")) ? "required" : ""}
                                label={t("PipeLineHeaderInfo_ProductFlowRateUOM")}
                                options={listOptions.volumeUOMOptions}
                                onChange={(data) => {
                                    onFieldChange("FlowRateUOM", data);
                                }}
                                error={t(validationErrors.FlowRateUOM)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modPipelineHeader.AssociatedMeterCodes}
                                label={t("Associated_Meters")}
                                options={listOptions.pipelineMeterList}
                                onChange={(data) => {
                                    onFieldChange("AssociatedMeterCodes", data);
                                }}
                                error={t(validationErrors.AssociatedMeterCodes)}
                                reserveSpace={false}
                                search={true}
                                multiple={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("PipeLineHeaderInfo_Status")}
                                value={modPipelineHeader.Active}
                                options={[
                                    { text: t("PipeLineHeaderInfo_Active"), value: true },
                                    { text: t("PipeLineHeaderInfo_Inactive"), value: false },
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
                                value={modPipelineHeader.Description}
                                onChange={(data) => onFieldChange("Description", data)}
                                label={t("PipeLineHeaderInfo_Remarks")}
                                error={t(validationErrors.Description)}
                                indicator={modPipelineHeader.Active !== pipelineHeader.Active ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>
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