import React from 'react';
import { Select, Accordion, Checkbox, Input } from '@scuf/common';
import { useTranslation } from "@scuf/localization";
import { DataTable } from '@scuf/datatable';
import PropTypes from "prop-types";

LocationDetails.propTypes = {
    location: PropTypes.object.isRequired,
    modLocation: PropTypes.object.isRequired,
};
export default function LocationDetails({
    location,
    modLocation,
    modAvailableDevices,
    modAssociatedDevices,
    selectedLocationType,
    validationErrors,
    checkBoxChanged,
    onFieldChange,
    handleCellDataEdit,
    onActiveStatusChange,
}) {
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
                        label={t(selectedLocationType + "Code")}
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
                        label={t(selectedLocationType + "Name")}
                        indicator="required"
                        onChange={(data) => onFieldChange("LocationName", data)}
                        error={t(validationErrors.LocationName)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={selectedLocationType}
                        disabled="true"
                        label={t("LocationType")}
                        onChange={(data) => onFieldChange("LocationType", data)}
                        reserveSpace={false}
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
            </div>
            <div className="row">
                <div className="col-3 pr-1 pb-0">
                    <h5>{t("Loc_AvailableDevices")}</h5>
                    <Accordion>
                        {
                            modAvailableDevices.map((AvailableDeviceList) =>
                                <Accordion.Content title={AvailableDeviceList.DeviceType} arrowPosition="left">
                                    {AvailableDeviceList.DeviceList.map((deviceList) =>
                                        <div>
                                            <Checkbox label={deviceList.DeviceCode} checked={deviceList.IsAssociated}
                                                onChange={(checked) => checkBoxChanged(deviceList.DeviceCode, AvailableDeviceList.DeviceType, checked)} />
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
