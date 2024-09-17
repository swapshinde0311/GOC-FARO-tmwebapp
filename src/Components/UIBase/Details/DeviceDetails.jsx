import React from 'react';
import "bootstrap/dist/css/bootstrap-grid.css";
import { Select, Checkbox, Input, Accordion, Button } from '@scuf/common';
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Constants from "../../../JS/Constants";
// import { getKeyByValue } from "../../../JS/Utilities";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import * as Utilities from "../../../JS/Utilities";

DeviceDetails.propTypes = {
    device: PropTypes.object.isRequired,
    modDevice: PropTypes.object.isRequired,
    modAssociatedChannel: PropTypes.array.isRequired,
    validationErrors: PropTypes.object.isRequired,
    channelValidationErrors: PropTypes.object.isRequired,
    onDeviceTypeChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        deviceTypeOptions: PropTypes.array,
        deviceModelOptions: PropTypes.array,
        channelTypeOptions: PropTypes.array,
        channelCodeOptions: PropTypes.array,
        densityUOMOptions: PropTypes.array,
        volumeUOMOptions: PropTypes.array,
        massUOMOptions: PropTypes.array,
        temperatureUOMOptions: PropTypes.array,
        pressureUOMOptions: PropTypes.array,
        transloadingOptions: PropTypes.array,
    }).isRequired,
    isBCU: PropTypes.bool.isRequired,
    handleSkipLocalLoadFetch: PropTypes.func,
    enableSkipLocalLoadFetch: PropTypes.bool
};

DeviceDetails.defaultProps = {
    listOptions: {
        deviceTypeOptions: [],
        deviceModelOptions: [],
        channelTypeOptions: [],
        channelCodeOptions: [],
        densityUOMOptions: [],
        volumeUOMOptions: [],
        massUOMOptions: [],
        temperatureUOMOptions: [],
        pressureUOMOptions: [],
        transloadingOptions: [],
    },
    isBCU: false,
    enableSkipLocalLoadFetch: false
}

export default function DeviceDetails({
    device,
    modDevice,
    listOptions,
    modAssociatedChannel,
    onFieldChange,
    onChannelFieldChange,
    onActiveStatusChange,
    deviceType,
    modAttributeMetaDataList,
    attributeValidationErrors,
    onAttributeDataChange,
    validationErrors,
    isMarineTransloading,
    isRailTransloading,
    channelValidationErrors,
    isBCU,
    handleSkipLocalLoadFetch,
    enableSkipLocalLoadFetch
}) {

    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }

    const channelDisabled = (modDevice.IsIntegrated === true) || deviceType === Constants.deviceTypeCode.WEIGH_BRIDGE ||
        (modDevice.DEUType !== undefined && modDevice.DEUType.toUpperCase() === Constants.DeviceModels.TouchScreen.toUpperCase()) ? true : false

    const [t] = useTranslation();
    return (
        <React.Fragment >
            <div className="detailsContainer deviceAccordian" >
                <div className="row" >

                    <div className="col-md-12 mt-4" >

                        <p className="border-bottom-1 pb-2 deviceheaderLabel">{t("DeviceInfo_DeviceData")}</p>

                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("DeviceInfo_DeviceType")}
                                    value={
                                        Utilities.getKeyByValue(Constants.deviceTypeCode, modDevice.DeviceType) ===
                                            undefined
                                            ? ""
                                            : Utilities.getKeyByValue(Constants.deviceTypeCode, modDevice.DeviceType)
                                    }
                                    // value={modDevice.deviceTypeOptions}
                                    options={listOptions.deviceTypeOptions}
                                    disabled={device.Code === "" ? false : true}
                                    onChange={(data) => onFieldChange("DeviceType", data)}
                                    indicator="required"
                                    reserveSpace={false}
                                    search={false}
                                    noResultsMessage={t("noResultsMessage")}
                                    error={t(validationErrors.DeviceType)}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <Input
                                    fluid
                                    value={modDevice.Code}
                                    label={t("DeviceInfo_Code")}
                                    indicator="required"
                                    disabled={device.Code === "" ? false : true}
                                    onChange={(data) => onFieldChange("Code", data)}
                                    reserveSpace={false}
                                    error={t(validationErrors.Code)}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("Common_Select")}
                                    label={t("DeviceInfo_ModelName")}
                                    value={modDevice.DeviceType !== Constants.deviceTypeCode.DEU ? modDevice.Model : modDevice.DEUType}
                                    options={listOptions.deviceModelOptions}
                                    // disabled={true}
                                    onChange={(data) => onFieldChange(modDevice.DeviceType !== Constants.deviceTypeCode.DEU ? "Model" : "DEUType", data)}
                                    indicator="required"
                                    reserveSpace={false}
                                    search={false}
                                    noResultsMessage={t("noResultsMessage")}
                                />

                            </div>
                            {deviceType !== Constants.deviceTypeCode.WEIGH_BRIDGE && modDevice.DEUType !== Constants.DeviceModels.TouchScreen &&
                                modDevice.Model !== Constants.DeviceModels.AcculoadIII &&
                                modDevice.Model !== Constants.DeviceModels.AcculoadIV &&
                                modDevice.Model !== Constants.DeviceModels.DanLoad &&
                                modDevice.Model !== Constants.DeviceModels.VirtualPreset && modDevice.Model !== Constants.DeviceModels.Nedap ?
                                <div className="col-12 col-md-6 col-lg-4">
                                    <Input
                                        fluid
                                        label={t("DeviceInfo_NodeAddress")}
                                        value={modDevice.NodeAddress}
                                        reserveSpace={false}
                                        onChange={(data) => onFieldChange("NodeAddress", data)}
                                        error={t(validationErrors.NodeAddress)}
                                        indicator="required"
                                    />
                                </div> : null
                            }
                            <div className="col-12 col-md-6 col-lg-4">
                                <Input
                                    fluid
                                    label={t("DeviceInfo_DeviceName")}
                                    value={modDevice.Name}
                                    indicator="required"
                                    reserveSpace={false}
                                    onChange={(data) => onFieldChange("Name", data)}
                                    error={t(validationErrors.Name)}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <Input
                                    fluid
                                    label={t("DeviceInfo_PointName")}
                                    value={modDevice.PointName}
                                    indicator="required"
                                    reserveSpace={false}
                                    onChange={(data) => onFieldChange("PointName", data)}
                                    error={t(validationErrors.PointName)}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <Input
                                    fluid
                                    value={
                                        modDevice.Description === null
                                            ? ""
                                            : modDevice.Description
                                    }
                                    label={t("FinishedProductList_Description")}
                                    reserveSpace={false}
                                    onChange={(data) => onFieldChange("Description", data)}
                                    error={t(validationErrors.Description)}
                                />
                            </div>
                            <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                    fluid
                                    placeholder={t("FinishedProductInfo_Select")}
                                    label={t("Cust_Status")}
                                    value={modDevice.Active}
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
                                        modDevice.Remarks === null ? "" : modDevice.Remarks
                                    }
                                    label={t("Cust_Remarks")}
                                    onChange={(data) => onFieldChange("Remarks", data)}
                                    indicator={
                                        modDevice.Active !== device.Active ? "required" : ""
                                    }
                                    reserveSpace={false}
                                    error={t(validationErrors.Remarks)}
                                />
                            </div>

                            {
                                deviceType === Constants.deviceTypeCode.CARD_READER ?
                                    <div className="col-12 col-md-6 col-lg-4 ">
                                        <div class="ui input-label">
                                            <span className="input-label-message">{t("DeviceInfo_IsIntegrated")}</span>
                                        </div>
                                        <div className="input-wrap">
                                            <Checkbox
                                                onChange={(data) => onFieldChange("IsIntegrated", data)}
                                                checked={modDevice.IsIntegrated}
                                                disabled={modDevice.IsIntegrated ? true : false}
                                            />
                                        </div>
                                    </div> : null
                            }
                            {deviceType === Constants.deviceTypeCode.BCU ?
                                <>
                                    {modDevice.Model.toUpperCase() === Constants.DeviceModels.MSCL.toUpperCase()
                                        || modDevice.Model.toUpperCase() === Constants.DeviceModels.AcculoadIII.toUpperCase()
                                        || modDevice.Model.toUpperCase() === Constants.DeviceModels.AcculoadIV.toUpperCase()
                                        ?
                                        <div className="col-12 col-md-6 col-lg-4 ">
                                            <div className="ui single-input fluid disabled" style={{ width: "30%", float: "left" }}>
                                                <div class="ui input-label">
                                                    <span className="input-label-message">{t("Device_DualBay")}</span>
                                                </div>
                                                <div className="input-wrap">
                                                    <Checkbox
                                                        onChange={(data) => onFieldChange("IsDualBay", data)}
                                                        checked={modDevice.IsDualBay}
                                                        disabled={device.Code === "" ? false : true}
                                                    />
                                                </div>
                                            </div>
                                            {
                                                modDevice.IsDualBay === true ?
                                                    <div style={{ width: "70%", float: "right" }}>
                                                        <Input
                                                            fluid
                                                            value={modDevice.PointName + "_1," + modDevice.PointName + "_2"}
                                                            label={t("BCUAssociatedPoints")}
                                                            reserveSpace={false}
                                                            disabled={true}
                                                        />
                                                    </div> : null
                                            }

                                        </div> : null}
                                    {
                                        isMarineTransloading === true || isRailTransloading === true ?
                                            <div className="col-12 col-md-6 col-lg-4 ">
                                                <div className="ui single-input fluid disabled" style={{ width: "30%", float: "left" }}>
                                                    <div class="ui input-label">
                                                        <span className="input-label-message">{t("Device_Transloading")}</span>
                                                    </div>
                                                    <div className="input-wrap">
                                                        <Checkbox
                                                            onChange={(data) => onFieldChange("IsTransloading", data)}
                                                            checked={modDevice.IsTransloading}
                                                            disabled={
                                                                device.Code !== ""
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                {
                                                    modDevice.IsTransloading ?
                                                        <div style={{ width: "70%", float: "right" }}>
                                                            <Select
                                                                fluid
                                                                placeholder={t("Common_Select")}
                                                                label={t("Receipt_Source")}
                                                                value={modDevice.ReceiptSource}
                                                                options={Utilities.transferListtoOptions(
                                                                    listOptions.transloadingOptions
                                                                )}
                                                                onChange={(data) => onFieldChange("ReceiptSource", data)}
                                                                disabled={device.Code !== ""}
                                                                reserveSpace={false}
                                                                indicator={true}
                                                                search={false}
                                                                noResultsMessage={t("noResultsMessage")}
                                                            />
                                                        </div> : ("")
                                                }

                                            </div>
                                            : ("")}
                                </> : null
                            }
                            {
                                modDevice.ReceiptSource === "RAIL" ?
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <Select
                                            fluid
                                            placeholder={t("Common_Select")}
                                            label={t("BCUIdentification")}
                                            value={modDevice.CardReaderCode}
                                            options={Constants.Identification}
                                            reserveSpace={false}
                                            indicator={true}
                                            search={false}
                                            onChange={(data) => onFieldChange("CardReaderCode", data)}
                                            noResultsMessage={t("noResultsMessage")}
                                        />

                                    </div> : ""
                            }
                        </div>
                    </div>
                </div>

                {deviceType === Constants.deviceTypeCode.BCU || modDevice.deviceTypeOptions === "BCU" ?

                    <Accordion>
                        <Accordion.Content
                            className="attributeAccordian"
                            title={t("BCU_Attributes")}
                        >
                            < div className="row pt-3" >

                                <div className="col-md-12">
                                    <div className="row">

                                        <div className="col-12 col-md-6 col-lg-4">
                                            <Select
                                                fluid
                                                placeholder={t("Common_Select")}
                                                label={t("BCU_AdditiveUOM")}
                                                value={modDevice.AdditiveUOM}
                                                options={listOptions.volumeUOMOptions}
                                                onChange={(data) => onFieldChange("AdditiveUOM", data)}
                                                indicator="required"
                                                reserveSpace={false}
                                                search={false}
                                                noResultsMessage={t("noResultsMessage")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <Select
                                                fluid
                                                placeholder={t("Common_Select")}
                                                label={t("BCU_DensityUOM")}
                                                value={modDevice.DensityUOM}
                                                options={listOptions.densityUOMOptions}
                                                onChange={(data) => onFieldChange("DensityUOM", data)}
                                                indicator="required"
                                                reserveSpace={false}
                                                search={false}
                                                noResultsMessage={t("noResultsMessage")}
                                            />


                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <Select
                                                fluid
                                                placeholder={t("Common_Select")}
                                                label={t("BCU_PressureUOM")}
                                                value={modDevice.PressureUOM}
                                                options={listOptions.pressureUOMOptions}
                                                onChange={(data) => onFieldChange("PressureUOM", data)}
                                                indicator="required"
                                                reserveSpace={false}
                                                search={false}
                                                noResultsMessage={t("noResultsMessage")}
                                            />


                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <Select
                                                fluid
                                                placeholder={t("Common_Select")}
                                                label={t("BCU_TemperatureUOM")}
                                                value={modDevice.TemperatureUOM}
                                                options={listOptions.temperatureUOMOptions}
                                                onChange={(data) => onFieldChange("TemperatureUOM", data)}
                                                indicator="required"
                                                reserveSpace={false}
                                                search={false}
                                                noResultsMessage={t("noResultsMessage")}
                                            />


                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <Select
                                                fluid
                                                placeholder={t("Common_Select")}
                                                label={t("BCU_MassUOM")}
                                                value={modDevice.MassUOM}
                                                options={listOptions.massUOMOptions}
                                                onChange={(data) => onFieldChange("MassUOM", data)}
                                                indicator="required"
                                                reserveSpace={false}
                                                search={false}
                                                noResultsMessage={t("noResultsMessage")}
                                            />


                                        </div>
                                    </div>


                                </div>
                            </div>
                        </Accordion.Content>
                    </Accordion> : null
                }
                {deviceType === Constants.deviceTypeCode.WEIGH_BRIDGE ?

                    <Accordion>
                        <Accordion.Content
                            className="attributeAccordian"
                            title={t("WB_Specific_Attributes")}
                        >
                            < div className="row pt-3" >

                                <div className="col-md-12">
                                    <div className="row">

                                        <div className="col-12 col-md-6 col-lg-4">
                                            <Select
                                                fluid
                                                placeholder={t("Common_Select")}
                                                label={t("WB_WeightUOM")}
                                                value={modDevice.WeightUOM}
                                                options={listOptions.massUOMOptions}
                                                onChange={(data) => onFieldChange("WeightUOM", data)}
                                                indicator="required"
                                                reserveSpace={false}
                                                search={false}
                                                noResultsMessage={t("noResultsMessage")}
                                                error={t(validationErrors.WeightUOM)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4">
                                            <Checkbox className="deviceCheckBox customDeviceCheckBox"
                                                label={t("WB_Auto")}
                                                checked={modDevice.IsAuto}
                                                onChange={(data) => onFieldChange("IsAuto", data)}
                                            >
                                            </Checkbox>


                                        </div>

                                    </div>


                                </div>
                            </div>
                        </Accordion.Content>
                    </Accordion> : null
                }
                {
                    modAttributeMetaDataList.length > 0 ?
                        modAttributeMetaDataList.map((attire) => (
                            <div>
                                {
                                    attire.attributeMetaDataList.filter(item => { return item.IsVisible === true }).length > 0 ?
                                        <ErrorBoundary>
                                            <Accordion>
                                                <Accordion.Content
                                                    className="attributeAccordian"
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
                                        : null}
                            </div>
                        )

                        ) : null
                }
                <div className="row" >

                    <div className="col-md-12 mt-4" >
                        <p className="border-bottom-1 pb-2 deviceheaderLabel">{t("DeviceInfo_ChannelData")}</p>
                    </div>
                    <div className="col-md-12">
                        {modAssociatedChannel.map((associatedChannel) =>
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div style={{ width: "70%", float: "left" }}>
                                        {
                                            modDevice.MultiDrop ?
                                                <Select
                                                    fluid
                                                    placeholder={t("FinishedProductInfo_Select")}
                                                    label={t("Channel_Code")}
                                                    value={associatedChannel.ChannelCode}
                                                    options={listOptions.channelCodeOptions}
                                                    indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                                    reserveSpace={false}
                                                    disabled={channelDisabled}
                                                    onChange={(data) => onChannelFieldChange("ChannelCode", data)}
                                                />
                                                :
                                                <Input
                                                    fluid
                                                    label={t("Channel_Code")}
                                                    value={associatedChannel.ChannelCode}
                                                    disabled={channelDisabled}
                                                    reserveSpace={false}
                                                    onChange={(data) => onChannelFieldChange("ChannelCode", data)}
                                                    error={t(channelValidationErrors.ChannelCode)}
                                                    indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                                />
                                        }
                                    </div>
                                    <div className="ui single-input fluid disabled" style={{ width: "28%", float: "right" }}>
                                        <div class="ui input-label">
                                            <span className="input-label-message">{t("DeviceInfo_IsMultiDrop")}</span>
                                        </div>
                                        <div className="input-wrap">
                                            <Checkbox
                                                onChange={(data) => onFieldChange("MultiDrop", data)}
                                                checked={modDevice.MultiDrop}
                                                disabled={channelDisabled || modDevice.DEUType === Constants.DeviceModels.DEUContrec1030 ||
                                                    (device.Code !== "" && modDevice.DeviceType === Constants.deviceTypeCode.DEU)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4">
                                    <div style={{ width: "70%", float: "left" }}>
                                        <Select
                                            fluid
                                            placeholder={t("FinishedProductInfo_Select")}
                                            label={t("ChannelTypeList_Title")}
                                            value={associatedChannel.ChannelType}
                                            options={listOptions.channelTypeOptions}
                                            disabled={channelDisabled}
                                            onChange={(data) => onChannelFieldChange("ChannelType", data)}
                                            error={t(channelValidationErrors.ChannelType)}
                                            indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                            reserveSpace={false}
                                        />
                                    </div>
                                    <div className="ui single-input fluid disabled" style={{ width: "28%", float: "right" }}>
                                        <div class="ui input-label">
                                            <span className="input-label-message">{t("DeviceInfo_IsEthernet")}</span>
                                        </div>
                                        <div className="input-wrap">
                                            <Checkbox
                                                onChange={(data) => onChannelFieldChange("PortType", data)}
                                                checked={associatedChannel.PortType === 1}
                                                disabled={channelDisabled || (modDevice.Model !== Constants.DeviceModels.MSCL && modDevice.Model !== Constants.DeviceModels.Multiload && modDevice.Model !== Constants.DeviceModels.Microload)}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <Input
                                        fluid
                                        label={t("Channel_PrimaryAddress")}
                                        value={associatedChannel.PrimaryAddress}
                                        disabled={channelDisabled}
                                        reserveSpace={false}
                                        onChange={(data) => onChannelFieldChange("PrimaryAddress", data)}
                                        error={t(channelValidationErrors.PrimaryAddress)}
                                        indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                    />
                                </div>

                                <div className="col-12 col-md-6 col-lg-4">
                                    <Input
                                        fluid
                                        label={t("Channel_SecondaryAddress")}
                                        value={associatedChannel.SecondaryAddress}
                                        disabled={channelDisabled}
                                        reserveSpace={false}
                                        onChange={(data) => onChannelFieldChange("SecondaryAddress", data)}
                                        error={t(channelValidationErrors.SecondaryAddress)}
                                    />
                                </div>

                                <div className="col-12 col-md-6 col-lg-4">
                                    <Input
                                        fluid
                                        label={t("ExeConfigInfo_PrimaryPort")}
                                        value={associatedChannel.PrimaryPort}
                                        disabled={channelDisabled}
                                        reserveSpace={false}
                                        onChange={(data) => onChannelFieldChange("PrimaryPort", data)}
                                        error={t(channelValidationErrors.PrimaryPort)}
                                        indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                    />

                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <Input
                                        fluid
                                        label={t("Channel_SecondaryPort")}
                                        value={associatedChannel.SecondaryPort}
                                        disabled={channelDisabled}
                                        reserveSpace={false}
                                        onChange={(data) => onChannelFieldChange("SecondaryPort", data)}
                                        error={t(channelValidationErrors.SecondaryPort)}
                                    />
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div style={{ width: "30%", float: "right", marginTop: "2rem" }}>
                                        <span style={{ marginLeft: "1rem" }}>{t("Milliseconds")}</span>
                                    </div>
                                    <div style={{ width: "70%", float: "left" }}>
                                        <Input
                                            fluid
                                            label={t("Channel_SendTimeOut")}
                                            value={associatedChannel.SendTimeOut}
                                            disabled={channelDisabled}
                                            reserveSpace={false}
                                            onChange={(data) => onChannelFieldChange("SendTimeOut", data)}
                                            error={t(channelValidationErrors.SendTimeOut)}
                                            indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div style={{ width: "30%", float: "right", marginTop: "2rem" }}>
                                        <span style={{ marginLeft: "1rem" }}>{t("Milliseconds")}</span>
                                    </div>
                                    <div style={{ width: "70%", float: "left" }}>
                                        <Input
                                            fluid
                                            label={t("Channel_RetryInterval")}
                                            value={associatedChannel.RetryInterval}
                                            disabled={channelDisabled}
                                            reserveSpace={false}
                                            onChange={(data) => onChannelFieldChange("RetryInterval", data)}
                                            error={t(channelValidationErrors.RetryInterval)}
                                            indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div style={{ width: "30%", float: "right", marginTop: "2rem" }}>
                                        <span style={{ marginLeft: "1rem" }}>{t("Milliseconds")}</span>
                                    </div>
                                    <div style={{ width: "70%", float: "left" }}>
                                        <Input
                                            fluid
                                            label={t("Channel_ReceiveTimeOut")}
                                            value={associatedChannel.ReceiveTimeOut}
                                            disabled={channelDisabled}
                                            reserveSpace={false}
                                            onChange={(data) => onChannelFieldChange("ReceiveTimeOut", data)}
                                            error={t(channelValidationErrors.ReceiveTimeOut)}
                                            indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                        />
                                    </div>
                                </div>
                                < div className="col-12 col-md-6 col-lg-4" >
                                    <Input
                                        fluid
                                        label={t("Channel_ConnectionRetries")}
                                        value={associatedChannel.ConnectionRetries}
                                        disabled={channelDisabled}
                                        reserveSpace={false}
                                        onChange={(data) => onChannelFieldChange("ConnectionRetries", data)}
                                        error={t(channelValidationErrors.ConnectionRetries)}
                                        indicator={associatedChannel.ChannelCode !== "" ? "required" : ""}
                                    />

                                </div>

                            </div>
                        )}

                    </div>
                </div>
                {isBCU ?
                    <div className="deviceskipLocalLoadFetch"
                        style={{ float: "right" }}>
                        <Button
                            content={t("DeviceInfo_SkipLocalLoadFetch")}
                            disabled={!enableSkipLocalLoadFetch}
                            onClick={handleSkipLocalLoadFetch}
                        ></Button>
                    </div> : null}
            </div >
        </React.Fragment >
    );
}
