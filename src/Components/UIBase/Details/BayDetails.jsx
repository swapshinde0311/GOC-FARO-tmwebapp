import React from 'react';
import { Select, Accordion, Checkbox, Input } from '@scuf/common';
import { useTranslation } from "@scuf/localization";
import { DataTable } from '@scuf/datatable';
import PropTypes from "prop-types";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

BayDetails.propTypes = {
    location: PropTypes.object.isRequired,
    modLocation: PropTypes.object.isRequired,
};
export default function BayDetails({
    location,
    modLocation,
    bay,
    modBay,
    modAvailableDevices,
    modAssociatedDevices,
    selectedLocationType,
    validationErrors,
    checkBoxChanged,
    onFieldChange,
    listOptions,
    handleCellDataEdit,
    onActiveStatusChange,
    attributeValidationErrors,
    modAttributeMetaDataList,
    onAttributeDataChange
}) {

    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }
    const [t] = useTranslation();
    const handleCustomEditTextBox = (cellData) => {
        return (
            <Input
                fluid
                value={modAssociatedDevices[cellData.rowIndex][cellData.field]}
                onChange={(value) => handleCellDataEdit(value, cellData)}
                reserveSpace={false}
            />
        );
    };

    return (
        <div className="detailsContainer">
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modLocation.LocationCode}
                        label={selectedLocationType==="Bay" ||selectedLocationType==="Cluster" ?t(selectedLocationType + " Code"):t("LocationInfo_BerthCode")}
                        indicator="required"
                        disabled={location.LocationCode !== ""}
                        onChange={(data) => onFieldChange("LocationCode", data)}
                        error={t(validationErrors.LocationCode)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modLocation.LocationName}
                        label={selectedLocationType==="Bay" || selectedLocationType==="Cluster"?t(selectedLocationType + "  Name"):t("LocationInfo_BerthName")}
                        indicator="required"
                        onChange={(data) => onFieldChange("LocationName", data)}
                        error={t(validationErrors.LocationName)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder={t("Common_Select")}
                        label={selectedLocationType==="Bay"?t("BayGroupList_BayType"):selectedLocationType==="Cluster"?t("LocationInfo_ClusterType"):t("LocationInfo_BerthType")}
                        value={modBay.BayType}
                        options={listOptions.bayTypeOptions}
                        disabled={location.LocationCode !== ""}
                        onChange={(data) => onFieldChange("BayType", data)}
                        indicator="required"
                        reserveSpace={false}
                        search={false}
                        noResultsMessage={t("noResultsMessage")}
                    />
                </div>
                {selectedLocationType==="Bay"?
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={selectedLocationType}
                        disabled="true"
                        label={t("LocationType")}
                        onChange={(data) => onFieldChange("LocationType", data)}
                        reserveSpace={false}
                    />
                </div>:""}
                {selectedLocationType==="Bay" || selectedLocationType==="Cluster"?
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modBay.MaximumQueue}
                        label={t("Bay_MaxQue")}
                        onChange={(data) => onFieldChange("MaximumQueue", data)}
                        error={t(validationErrors.MaximumQueue)}
                        reserveSpace={false}
                    />
                </div>:""}
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modBay.BayPriority}
                        label={selectedLocationType==="Bay" ?t("Bay_Priority"):selectedLocationType==="Cluster"?t("LocationInfo_ClusterPriority"):t("LocationInfo_BerthPriority")}
                        onChange={(data) => onFieldChange("BayPriority", data)}
                        error={t(validationErrors.BayPriority)}
                        reserveSpace={false}
                    />
                </div>
                {selectedLocationType==="Bay"||selectedLocationType==="Cluster"?
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modBay.IslandCode}
                        label={ selectedLocationType==="Bay" ? t("Bay_Island"):selectedLocationType==="Cluster"?t("Spur_Code"):t("Bay_Island")}
                        disabled={true}
                        onChange={(data) => onFieldChange("IslandCode", data)}
                        reserveSpace={false}
                    />
                </div>:""}
                {selectedLocationType==="Bay"?
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder={t("Common_Select")}
                        label={t("Bay_VehicleSpecificType")}
                        value={modBay.VehicleSpecificType}
                        options={[
                            { text: "DEFENCE", value: "DEFENCE" },
                            { text: "AEROVEHICLES", value: "AEROVEHICLES" },
                            { text: "AGENTTRUCK", value: "AGENTTRUCK" },
                        ]}
                        onChange={(data) => onFieldChange("VehicleSpecificType", data)}
                        reserveSpace={false}
                        search={false}
                        noResultsMessage={t("noResultsMessage")}
                    />
                </div>:""}
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder={t("Common_Select")}
                        label={t("BayGroupList_LoadingType")}
                        value={modBay.LoadingType}
                        options={listOptions.loadingTypeOptions}
                        disabled={location.LocationCode !== ""}
                        onChange={(data) => onFieldChange("LoadingType", data)}
                        reserveSpace={false}
                        search={false}
                        noResultsMessage={t("noResultsMessage")}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={
                            modLocation.Description === null
                                ? ""
                                : modLocation.Description
                        }
                        label={t("FinishedProductList_Description")}
                        onChange={(data) => onFieldChange("Description", data)}
                        error={t(validationErrors.Description)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder={t("FinishedProductInfo_Select")}
                        label={t("Cust_Status")}
                        value={modLocation.Active}
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
                            modLocation.Remarks === null ? "" : modLocation.Remarks
                        }
                        label={t("Cust_Remarks")}
                        onChange={(data) => onFieldChange("Remarks", data)}
                        indicator={
                            modLocation.Active !== location.Active ? "required" : ""
                        }
                        error={t(validationErrors.Remarks)}
                        reserveSpace={false}
                    />
                </div>
                {selectedLocationType==="Bay"?
                <div className="col-12 col-md-6 col-lg-4 ">
                    <Checkbox className="deviceCheckBox"

                        label={t("Bay_VolumeBased")}
                        checked={modBay.IsVolumeBased}
                        onChange={(checked) =>
                            onFieldChange("IsVolumeBased", checked)
                        }
                    >
                    </Checkbox>
                    <Checkbox className="deviceCheckBox"

                        label={t("Bay_IsEnableInBayAllocation")}
                        checked={modBay.EnabledForBayAllocation}
                        onChange={(checked) =>
                            onFieldChange("EnabledForBayAllocation", checked)
                        }
                    >
                    </Checkbox>

                </div>:""}
                {
selectedLocationType==="Cluster"?
<div className="col-12 col-md-6 col-lg-4 ">
<Checkbox className="deviceCheckBox"

label={t("Bay_VolumeBased")}
checked={modBay.IsVolumeBased}
onChange={(checked) =>
    onFieldChange("IsVolumeBased", checked)
}
>
</Checkbox>
</div>:""
                }
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

            <div className="row pt-3">
                <div className="col-3 pr-1 pb-0">
                    <h5>{t("Loc_AvailableDevices")}</h5>
                    <Accordion>
                        {
                            modAvailableDevices.map((AvailableDeviceList) =>
                                <Accordion.Content title={AvailableDeviceList.DeviceType} arrowPosition="left">
                                    {AvailableDeviceList.DeviceList.map((deviceList) =>
                                        <div>
                                            <Checkbox label={deviceList.DeviceCode} checked={deviceList.IsAssociated} onChange={(checked) => checkBoxChanged(deviceList.DeviceCode, AvailableDeviceList.DeviceType, checked)} />
                                        </div>

                                    )}
                                </Accordion.Content>
                            )
                        }
                    </Accordion>
                </div>
                <div className="col-9 pb-0">
                    <h5>{t("Loc_AssociatedDevices")}</h5>
                    <DataTable
                        data={modAssociatedDevices}
                    >
                        <DataTable.Column
                            className="compColHeight"
                            key="DeviceCode"
                            field="DeviceCode"
                            header={t("Loc_DeviceCode")}
                            editable={true}
                            sortable={true}
                            editFieldType="text"
                            customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="DeviceType"
                            field="DeviceType"
                            header={t("Loc_DeviceType")}
                            editable={true}
                            sortable={true}
                            editFieldType="text"
                            customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="DeviceModel"
                            field="DeviceModel"
                            header={t("Loc_DeviceModel")}
                            editable={true}
                            sortable={true}
                            editFieldType="text"
                            customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>

                    </DataTable>
                </div>
            </div>
        </div>

    );
}
