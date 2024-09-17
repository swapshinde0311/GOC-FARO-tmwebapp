import React from "react";
import { Select, Input, Checkbox, Icon, Accordion } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";

ShareholderDetails.propTypes = {
    shareholder: PropTypes.object.isRequired,
    modShareholder: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    modAttributeMetaDataList: PropTypes.array.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onExternalSystemCodeChange: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    onAllTerminalsChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        terminalCodes: PropTypes.array,

    }).isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    isDCHEnabled: PropTypes.bool.isRequired,
    isSealingEnabled: PropTypes.bool.isRequired,
    handleAttributeDataChange: PropTypes.func.isRequired,
}

ShareholderDetails.defaultProps = {
    listOptions: { terminalCodes: [], ExternalSystemInfo: [], SealCodes: [] },
    isEnterpriseNode: false, isDCHEnabled: false, isSealingEnabled: false
}

export function ShareholderDetails({
    shareholder,
    modShareholder,
    validationErrors,
    onFieldChange,
    onActiveStatusChange,
    onAllTerminalsChange,
    listOptions,
    isEnterpriseNode,
    onExternalSystemCodeChange,
    isDCHEnabled,
    modAttributeMetaDataList,
    attributeValidationErrors,
    handleAttributeDataChange,
    isSealingEnabled
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
                                value={modShareholder.ShareholderCode}
                                indicator="required"
                                disabled={shareholder.ShareholderCode !== ""}
                                onChange={(data) => onFieldChange("ShareholderCode", data)}
                                label={t("ShareholderDetails_Code")}
                                error={t(validationErrors.ShareholderCode)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modShareholder.ShareholderName}
                                indicator="required"
                                onChange={(data) => onFieldChange("ShareholderName", data)}
                                label={t("ShareholderDetails_Name")}
                                error={t(validationErrors.ShareholderName)}
                                reserveSpace={false}
                            />
                        </div>
                        {
                            isSealingEnabled ? (<div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("ShareholderDetails_SealId")}
                                    value={modShareholder.SealCode}
                                    options={getOptionsWithSelect(
                                        listOptions.SealCodes,
                                        t("Common_Select")
                                    )}
                                    onChange={(data) => onFieldChange("SealCode", data)}
                                    reserveSpace={false}
                                    search={true}
                                    noResultsMessage={t("noResultsMessage")}
                                />
                            </div>) : ("")
                        }

                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modShareholder.Description}
                                onChange={(data) => onFieldChange("Description", data)}
                                label={t("ShareholderDetails_Description")}
                                error={t(validationErrors.Description)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t(`ShareholderDetails_Status`)}
                                value={modShareholder.Active}
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
                                value={modShareholder.Remarks}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                label={t("ShareholderDetails_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modShareholder.Active !== shareholder.Active ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>
                        {
                            isEnterpriseNode ? (
                                <div className="col-12 col-md-6 col-lg-4">
                                    <AssociatedTerminals
                                        terminalList={listOptions.terminalCodes}
                                        selectedTerminal={modShareholder.TerminalCodes}
                                        validationError={t(validationErrors.TerminalCodes)}
                                        onFieldChange={onFieldChange}
                                        onCheckChange={onAllTerminalsChange}
                                    ></AssociatedTerminals>
                                </div>
                            ) : ("")
                        }
                        {
                            isDCHEnabled ? (
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div style={{ width: "60%" }}>
                                            <Select
                                                fluid
                                                placeholder={t("Common_Select")}
                                                label={t("ShareholderDetails_ExternalSystem")}
                                                value={modShareholder.ExternalSystemCode}
                                                options={listOptions.ExternalSystemInfo}
                                                onChange={(data) => onExternalSystemCodeChange(data)}
                                                reserveSpace={false}
                                                search={true}
                                                noResultsMessage={t("noResultsMessage")}
                                            />
                                        </div>
                                        <div className="ddlSelectAll">
                                            <Checkbox
                                                label={t("ShareholderDetails_BypassMode")}
                                                checked={modShareholder.IsBypass ? true : false}
                                                onChange={(data) => onFieldChange("IsBypass", data)}
                                                disabled={modShareholder.ExternalSystemCode === "1"}
                                            />
                                        </div>
                                        <div>
                                            <Icon root="common" title={t("Shareholder_BypassTooltip")} name="badge-info" size="medium" />
                                        </div>
                                    </div>
                                </div>
                            ) : ("")
                        }
                    </div>
                    {
                        modAttributeMetaDataList.length > 0 ?
                        modAttributeMetaDataList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion>
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={handleAttributeDataChange}
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

