import React from "react";
import { Select, Input, Badge } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";

TankGroupDetails.propTypes = {
    tankGroup: PropTypes.object.isRequired,
    modTankGroup: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        baseProduct: PropTypes.array,
    }).isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    handleSelectTankCode: PropTypes.func.isRequired,
    onTerminalChange: PropTypes.func.isRequired,
}

TankGroupDetails.defaultProps = {
    listOptions: {
        baseProduct: [],
        terminalCode: []
    },
    isEnterpriseNode: false
}

export function TankGroupDetails({
    tankGroup,
    modTankGroup,
    validationErrors,
    onFieldChange,
    onActiveStatusChange,
    listOptions,
    isEnterpriseNode,
    handleSelectTankCode,
    onTerminalChange
}) {

    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTankGroup.Code}
                                indicator="required"
                                disabled={tankGroup.Code !== ""}
                                onChange={(data) => onFieldChange("Code", data)}
                                label={t("TankGroupInfo_Code")}
                                error={t(validationErrors.Code)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTankGroup.Name}
                                onChange={(data) => onFieldChange("Name", data)}
                                label={t("TankGroupInfo_Name")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTankGroup.Description}
                                label={t("TankInfo_Description")}
                                onChange={(data) => onFieldChange("Description", data)}
                                error={t(validationErrors.Description)}
                                reserveSpace={false}
                            />
                        </div>
                        {isEnterpriseNode ? (
                            <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("TerminalCodes")}
                                    value={modTankGroup.TerminalCode}
                                    options={listOptions.terminalCode}
                                    onChange={(data) => {
                                        onTerminalChange(data);
                                    }}
                                    indicator="required"
                                    error={t(validationErrors.TerminalCode)}
                                    reserveSpace={false}
                                    disabled={tankGroup.Code !== ""}
                                    search={true}
                                    noResultsMessage={t("noResultsMessage")}
                                />
                            </div>
                        ) : ("")
                        }

                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("TankGroupInfo_BaseProduct")}
                                value={modTankGroup.BaseProductCode}
                                options={listOptions.baseProduct}
                                onChange={(data) => {
                                    onFieldChange("BaseProductCode", data);
                                }}
                                indicator="required"
                                error={t(validationErrors.BaseProductCode)}
                                reserveSpace={false}
                                search={true}
                                disabled={(modTankGroup.TankCollection.length > 0 || modTankGroup.MeterCollection.length > 0)}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("BaseProductList_Status")}
                                value={modTankGroup.Active}
                                options={[
                                    { text: t("ViewShipment_Ok"), value: true },
                                    { text: t("ViewShipmentStatus_Inactive"), value: false },
                                ]}
                                onChange={(data) => onActiveStatusChange(data)}
                                error={t(validationErrors.Active)}
                                reserveSpace={false}
                                search={true}
                                disabled={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modTankGroup.Remarks}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                label={t("BaseProductList_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modTankGroup.Active !== tankGroup.Active ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>
                        {
                            tankGroup.Code !== "" ? (
                                <>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <div>{t("TankGroupInfo_AssociatedTank")}</div>
                                        <div className="associatedTank-wrap">
                                            {
                                                modTankGroup.TankCollection.map((tank) => {
                                                    return (
                                                        <div className="associatedTank-wrap-list">
                                                            <label><span>{tank}</span>{tank === modTankGroup.ActiveTankCode ? (<Badge className='badge-TankGroup' color='green'>{t("TankGroupInfo_Active")}</Badge>) : (<a href="#/" onClick={() => handleSelectTankCode(tank)} className="tankGroupAnchorTag">{t("TankGroupInfo_TankActivate")}</a>)}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <Select
                                            fluid
                                            placeholder={t("Common_Select")}
                                            label={t("TankGroupInfo_AssociatedMeter")}
                                            value={modTankGroup.MeterCollection}
                                            options={Utilities.transferListtoOptions(modTankGroup.MeterCollection)}
                                            //options={modTankGroup.MeterCollection}
                                            reserveSpace={false}
                                            disabled={true}
                                            search={true}
                                            noResultsMessage={t("noResultsMessage")}
                                            multiple={true}
                                        />
                                    </div></>
                            ) : ("")
                        }


                    </div>
                </div>
            )}
        </TranslationConsumer>
    )
}