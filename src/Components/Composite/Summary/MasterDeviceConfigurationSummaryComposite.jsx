import React from "react";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { Checkbox, Select, Button } from "@scuf/common";
import * as Constants from "../../../JS/Constants";

MasterDeviceConfigurationSummaryComposite.propTypes = {
    locationDeviceData: PropTypes.array.isRequired,
    deviceModelData: PropTypes.object.isRequired,
    onLocationDeviceRowClick: PropTypes.func.isRequired,
    onDeviceModelRowClick: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    transportationTypeOptions: PropTypes.array.isRequired,
    selectedTransportationType: PropTypes.string.isRequired,
    handleTransportationChange: PropTypes.func.isRequired,
    saveEnabled: PropTypes.bool.isRequired
};

export function MasterDeviceConfigurationSummaryComposite({
    locationDeviceData,
    deviceModelData,
    onSaveClick,
    transportationTypeOptions,
    selectedTransportationType,
    onFieldChange,
    saveEnabled
}) {
    const [t] = useTranslation();

    const formCheckBox = (cellData) => {
        let data = cellData.rowData
        return (
            <div
            >
                <div
                    style={{ width: "15%", float: "left", paddingTop: "4px", height: "0px" }}>
                    <Checkbox
                        checked={data.isActive}
                        onChange={(check) => onFieldChange(check, data, "LocationType")}
                        disabled={data.locationCode === "Bay" || data.locationCode === "MarineBay" ||
                            data.locationCode === "Pipeline" || data.locationCode === "Cluster" ||
                            data.locationCode === "Island"}
                    />
                </div>
                <div
                    style={{ width: "85%", float: "right" }}>
                    <span className="input-label-message">
                        {t(data.locationCode)}
                    </span>
                </div>
            </div>
        )
    }

    const formDeviceType = (cellData) => {
        let data = cellData.rowData
        return (
            Object.keys(data.deviceDetails).map((key => (
                <div
                    className="masterDeviceConfigDevices"
                >
                    <div
                        style={{ width: "15%", float: "left", paddingTop: "4px", height: "0px" }}
                    >
                        <Checkbox
                            checked={data.deviceDetails[key]}
                            disabled={!data.isActive || key === "BCU" || key === "PIPELINE"}
                            onChange={(check) => onFieldChange(check, data, key)}
                        />
                    </div>
                    <div
                        style={{ width: "85%", float: "right" }}>
                        <span className="input-label-message">
                            {t(key)}
                        </span>
                    </div>
                </div>
            )))
        )
    }

    const formDeviceModels = (cellData) => {
        let data = cellData.rowData
        let disable = true;

        locationDeviceData.forEach((item) => {
            if (item.deviceDetails[data.type])
                disable = false
        })

        data.disableAllModels = disable

        data.gridType = "Models"
        return (
            data.models.map((item => (
                <div
                    className="masterDeviceConfigDevices"
                >
                    <div
                        style={{ width: "15%", float: "left", paddingTop: "4px", height: "0px" }}
                    >
                        <Checkbox
                            checked={selectedTransportationType === Constants.TransportationType.PIPELINE ? true : item.Value}
                            disabled={selectedTransportationType === Constants.TransportationType.PIPELINE ? true : data.disableAllModels}
                            onChange={(check) => onFieldChange(check, data, item.Key)}
                        />
                    </div>
                    <div
                        style={{ width: "85%", float: "right" }}
                    >
                        <span className="input-label-message">
                            {t(item.Key)}
                        </span>
                    </div>
                </div >
            )))
        )
    }

    return (
        <div>
            <div className="detailsContainer">

                <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                        <label style={{ width: "9rem", float: "left", paddingTop: "5px" }}>{t("ProductAllocation_TransportationType")}</label>
                        <Select
                            className="masterDeviceTransportType"
                            fluid
                            placeholder={t("Common_Select")}
                            // label={t("ProductAllocation_TransportationType")}
                            value={selectedTransportationType}
                            options={transportationTypeOptions}
                            onChange={(data) => onFieldChange(data, "TransportationType")}
                            reserveSpace={false}
                            noResultsMessage={t("noResultsMessage")}
                        />
                    </div>
                </div>
                <div className="row marginRightZero tableScroll">
                    <div className="col-12 detailsTable">
                        <DataTable
                            data={locationDeviceData}
                        >
                            <DataTable.Column
                                className="compColHeight colminWidth fixedWidth"
                                key="locationCode"
                                field="locationCode"
                                // initialWidth="18rem"
                                header={t("LocationInfo_LocationType")}
                                renderer={(cellData) => formCheckBox(cellData)}
                            ></DataTable.Column>
                            <DataTable.Column
                                className="compColHeight colminWidth"
                                key="deviceDetails"
                                field="deviceDetails"
                                header={t("LocationInfo_DeviceType")}
                                renderer={(cellData) => formDeviceType(cellData)}
                            ></DataTable.Column>
                        </DataTable>
                    </div>
                </div>
                <div className="row marginRightZero tableScroll">
                    <div className="col-12 detailsTable">
                        <DataTable
                            data={deviceModelData}
                        >
                            <DataTable.Column
                                className="compColHeight colminWidth fixedWidth"
                                key="type"
                                field="type"
                                header={t("LocationInfo_DeviceType")}
                            // renderer={(cellData) => formSecondTableDeviceType(cellData)}
                            ></DataTable.Column>
                            <DataTable.Column
                                className="compColHeight colminWidth"
                                key="models"
                                field="models"
                                header={t("MasterConfig_Models")}
                                renderer={(cellData) => formDeviceModels(cellData)}
                            ></DataTable.Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <div className="row userActionPosition">

                <div className="col-12 col-md-12 col-lg-12">
                    <div style={{ float: "right" }}>
                        <Button
                            content={t("MasterConfig_Save")}
                            disabled={!saveEnabled}
                            onClick={onSaveClick}
                        ></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}