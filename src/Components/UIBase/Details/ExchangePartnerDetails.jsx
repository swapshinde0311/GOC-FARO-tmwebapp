import React from "react";
import { Input, Select } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";

ExchangePartnerDetails.propTypes = {
    exchangepartner: PropTypes.object.isRequired,
    modExchangePartner: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onShareholderChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        ShareholderOptions: PropTypes.array
    }).isRequired,
}

ExchangePartnerDetails.defaultProps = {
    isEnterpriseNode: false,
    listOptions: {
        ShareholderOptions: []
    }
}

export function ExchangePartnerDetails({
    exchangepartner,
    modExchangePartner,
    validationErrors,
    onFieldChange,
    listOptions,
}) {
    return (
        <TranslationConsumer>
            {(t, index) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modExchangePartner.ExchangePartnerName}
                                indicator="required"
                                disabled={exchangepartner.ExchangePartnerName !== ""}
                                onChange={(data) => onFieldChange("ExchangePartnerName", data)}
                                label={t("Exchange_Partner_Name")}
                                error={t(validationErrors.ExchangePartnerName)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("FinishedProductInfo_Select")}
                                value={modExchangePartner.SellerId == null ? "" : modExchangePartner.SellerId }
                                label={t("Exchange_Partner_SellerId")}
                                indicator="required"
                                options={listOptions.ShareholderOptions}
                                onChange={(data) => {
                                    onFieldChange("SellerId", data);
                                }}
                                error={t(validationErrors.SellerId)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("FinishedProductInfo_Select")}
                                value={modExchangePartner.FinalShipperID === null ? "" : modExchangePartner.FinalShipperID}
                                label={t("Exchange_Partner_FinalShipper")}
                                indicator="required"
                                options={listOptions.ShareholderOptions}
                                onChange={(data) => {
                                    onFieldChange("FinalShipperID", data);
                                }}
                                error={t(validationErrors.FinalShipperID)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                    </div>
                </div>

            )}
        </TranslationConsumer>
    )
}

