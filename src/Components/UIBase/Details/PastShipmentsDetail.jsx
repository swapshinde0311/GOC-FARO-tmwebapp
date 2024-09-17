import React from "react";
import { Input, Icon } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import dayjs from "dayjs";

PastShipmentsDetail.propTypes = {
    data: PropTypes.array.isRequired,
    selectedDate: PropTypes.object.isRequired,
    handleDateChange: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    handleViewBOL: PropTypes.func.isRequired,
};


export function PastShipmentsDetail({
    data,
    selectedDate,
    handleDateChange,
    onSearchChange,
    handleViewBOL,
}) {

    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer mobileContainDetail">

                    <div id="Date mobilePastDate" >
                        <div className="slotBlocksDispaly" style={{ justifyContent: "center" }}>
                            <div>
                                <Icon
                                    onClick={() => handleDateChange(-1)}
                                    style={{ cursor: "pointer" }}
                                    root="common"
                                    name="caret-left"
                                    exactSize={24}
                                ></Icon>
                            </div>
                            <div className="mobile-slot-date-span">
                                <span>{selectedDate.format("DD MMM YYYY")}</span>
                            </div>

                            <div>
                                <Icon
                                    onClick={() => handleDateChange(1)}
                                    style={{ cursor: "pointer" }}
                                    root="common"
                                    name="caret-right"
                                    exactSize={24}
                                ></Icon>
                            </div>
                        </div>
                    </div>
                    <div className="mobilePastSearch">
                        <div className="row" >

                            <div className="col-12 col-md-12 col-lg-12">
                                <Input style={{ border: "none" }} className="input-example mobile-input" placeholder={t("Common_Search")}
                                    icon={<Icon name="search" root="common" size="small" />} onChange={(data) => onSearchChange(data)} fluid={true} />
                            </div>
                        </div>
                    </div>
                    {
                        data.length > 0 ?
                            data.map((item, index) => {
                                return <div className="mobilePastTableHeader">
                                    <div className="row mobilePastHeaderRow" >

                                        <div className="col-4 col-md-4 col-lg-4">
                                            {t("Common_Code")}
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4">
                                            {t("ViewShipment_Vehicle")}
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4">
                                            {t("ViewShipment_Shareholder")}
                                        </div>
                                    </div>

                                    <div className="row mobilePastHeaderRowContent" >
                                        <div className="col-4 col-md-4 col-lg-4">
                                            {item.Code}
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4">
                                            {item.VehicleCode}
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4">
                                            {item.ShareHolder}
                                        </div>
                                    </div>
                                    <div className="row mobilepastTableBottom">
                                        <div className="col-8 col-md-8 col-lg-8 mobile-past-loaded-date">
                                            {t("ShipmentByCompartmentList_LoadedDate") + " : " + dayjs(item.LoadedDate).format("DD MMM YYYY")}
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4">
                                            <Icon
                                                onClick={() => handleViewBOL(item.Code, item.ShareHolder)}
                                                style={{ cursor: "pointer" }}
                                                root="common"
                                                name="document-standard"

                                                exactSize={20}
                                            ></Icon> <span className="mobilePastBOLButton" onClick={() => handleViewBOL(item.Code, item.ShareHolder)}>{t("Report_TMBOL")}</span>
                                        </div>
                                    </div>

                                </div>

                            }) : <div className="col-12 col-md-12 col-lg-12" style={{ textAlign: "center" }}>
                                {t("MarineDashboard_NoDataAvailable")}
                            </div>

                    }
                </div>
            )}
        </TranslationConsumer>
    );
}
