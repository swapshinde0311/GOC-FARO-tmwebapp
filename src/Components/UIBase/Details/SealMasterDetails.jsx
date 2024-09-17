import React from "react";
import { Input ,Accordion} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { AttributeDetails } from "../Details/AttributeDetails";

SealMasterDetails.propTypes = {
    sealmaster: PropTypes.object.isRequired,
    modSealmaster: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,

    isEnterpriseNode: PropTypes.bool.isRequired,
    selectedAttributeList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    handleCellDataEdit: PropTypes.func.isRequired,
}

SealMasterDetails.defaultProps = {
    isEnterpriseNode: false,
}

export function SealMasterDetails({
    sealmaster,
    modSealmaster,
    validationErrors,
    onFieldChange,
    isEnterpriseNode,
    selectedAttributeList,
    attributeValidationErrors,
    handleCellDataEdit,
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
            {(t, index) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modSealmaster.Code}
                                indicator="required"
                                disabled={sealmaster.Code !== ""}
                                onChange={(data) => onFieldChange("Code", data)}
                                label={t("SealMasterList_Code")}
                                error={t(validationErrors.Code)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modSealmaster.Prefix}
                                onChange={(data) => onFieldChange("Prefix", data)}
                                label={t("SealMasterList_Prefix")}
                                error={t(validationErrors.Prefix)}
                                reserveSpace={false}
                            />
                        </div>


                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modSealmaster.StartSealNo}
                                onChange={(data) => onFieldChange("StartSealNo", data)}
                                label={t("SealMaster_StartSealNo")}
                                error={t(validationErrors.StartSealNo)}
                                reserveSpace={false}
                                indicator="required"
                            />
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modSealmaster.EndSealNo}
                                onChange={(data) => onFieldChange("EndSealNo", data)}
                                label={t("SealMaster_EndSealNo")}
                                error={t(validationErrors.EndSealNo)}
                                reserveSpace={false}
                                indicator="required"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modSealmaster.CurrentSealNo}
                                onChange={(data) => onFieldChange("CurrentSealNo", data)}
                                label={t("SealMaster_CurrentSealNo")}
                                error={t(validationErrors.CurrentSealNo)}
                                reserveSpace={false}
                                indicator="required"
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modSealmaster.Suffix}
                                onChange={(data) => onFieldChange("Suffix", data)}
                                label={t("SealMaster_Suffix")}
                                error={t(validationErrors.Suffix)}
                                reserveSpace={false}
                            />
                        </div>
                    </div>

                    {
                        selectedAttributeList.length > 0 ?
                            selectedAttributeList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion >
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={handleCellDataEdit}
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

