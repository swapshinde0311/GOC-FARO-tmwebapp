import React from 'react';
// import { Select, Checkbox } from "@scuf/common";
import { Accordion, Select, Input, InputLabel, Checkbox } from '@scuf/common';
import { DataTable } from '@scuf/datatable';
import { useTranslation } from "@scuf/localization";
import { AttributeDetails } from "../../UIBase/Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import * as Constants from "../../../JS/Constants";

export default function LoadingArmDetails({
    loadingArm,
    modLoadingArm,
    modAssociations,
    listOptions,
    selectedRows,
    handleRowSelectionChange,
    handleCellDataEdit,
    validationErrors,
    onFieldChange,
    onActiveStatusChange,
    attributeValidationErrors,
    selectedAttributeList,
    handleAttributeCellDataEdit,
    deviceModel,
    IsDualBay,
    possibleSwingArmList,
    selectedSwingArmAssociations,
    onSwingArmAssociationSelectionChange
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
                value={modAssociations[cellData.rowIndex][cellData.field]}
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
                        value={modLoadingArm.Code}
                        label={t("Loadingrm_Code")}
                        indicator="required"
                        disabled={loadingArm.Code !== ""}
                        onChange={(data) => onFieldChange("Code", data)}
                        error={t(validationErrors.Code)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modLoadingArm.Name}
                        label={t("Loadingrm_Name")}
                        indicator="required"
                        onChange={(data) => onFieldChange("Name", data)}
                        error={t(validationErrors.Name)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={modLoadingArm.ArmNumberInBCU}
                        label={t("LoadingArmInfo_ArmNoInBCU")}
                        indicator="required"
                        onChange={(data) => onFieldChange("ArmNumberInBCU", data)}
                        error={t(validationErrors.ArmNumberInBCU)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder="Select"
                        label={t("BlendType_Title")}
                        value={modLoadingArm.BlendType}
                        disabled={loadingArm.Code !== ""}
                        indicator="required"
                        options={listOptions.deviceBlendOptions}
                        onChange={(data) => onFieldChange("BlendType", data)}
                        error={t(validationErrors.BlendType)}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Select
                        fluid
                        placeholder="Select"
                        label={t("LoadingArm_ArmLoadingType")}
                        value={modLoadingArm.ArmLoadingType}
                        disabled={loadingArm.Code !== ""}
                        indicator="required"
                        options={[
                            { text: "BOTH", value: "BOTH" },
                            { text: "LOADING", value: "LOADING" },
                            { text: "UNLOADING", value: "UNLOADING" },
                        ]}
                        onChange={(data) => onFieldChange("ArmLoadingType", data)}
                        error={t(validationErrors.ArmLoadingType)}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        label={t("BCU_NodeAddress")}
                        value={modLoadingArm.NodeAddress}
                        onChange={(data) => onFieldChange("NodeAddress", data)}
                        reserveSpace={false}
                        // indicator="required"
                        indicator={deviceModel === "Accuload-IV" || deviceModel === "Accuload-III" ? "required" : ""}
                        error={t(validationErrors.NodeAddress)}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <InputLabel
                        label={t("LoadingArm_CLFQty")}
                        indicator="required"
                    ></InputLabel>
                    <div className="row">
                        <div className="col-12 col-md-8 col-xl-9 pr-0"><Input
                            fluid
                            value={modLoadingArm.CleanLineFinishQuantity}
                            onChange={(data) => onFieldChange("CleanLineFinishQuantity", data)}
                            error={t(validationErrors.CleanLineFinishQuantity)}
                            reserveSpace={false}
                        /></div>
                        <div className="col-12 col-md-4 col-xl-3 pl-0">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modLoadingArm.CleanLineFinishQuantityUOM}
                                options={listOptions.densityUOMOptions}
                                onChange={(data) => onFieldChange("CleanLineFinishQuantityUOM", data)}
                                indicator="required"
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                    </div>

                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <InputLabel
                        label={t("LoadingArm_MLQty")}
                        indicator="required"
                    ></InputLabel>
                    <div className="row">
                        <div className="col-12 col-md-8 col-xl-9 pr-0"><Input
                            fluid
                            value={modLoadingArm.MinimumLoadableQuantity}
                            onChange={(data) => onFieldChange("MinimumLoadableQuantity", data)}
                            error={t(validationErrors.MinimumLoadableQuantity)}
                            reserveSpace={false}
                        /></div>
                        <div className="col-12 col-md-4 col-xl-3 pl-0">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modLoadingArm.MLQtyUOM}
                                options={listOptions.densityUOMOptions}
                                onChange={(data) => onFieldChange("MLQtyUOM", data)}
                                indicator="required"
                                reserveSpace={false}
                                search={false}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                    </div>

                </div>

                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        label={t("BCU_MainLineMeters")}
                        disabled={true}
                        value={modLoadingArm.MainlineMeters}
                        onChange={(data) => onFieldChange("MainlineMeters", data)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        disabled={true}
                        label={t("BCU_AdditiveMeters")}
                        value={modLoadingArm.AdditiveMeters}
                        onChange={(data) => onFieldChange("AdditiveMeters", data)}
                        reserveSpace={false}
                    />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <Input
                        fluid
                        value={
                            modLoadingArm.Description === null
                                ? ""
                                : modLoadingArm.Description
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
                        value={modLoadingArm.Status}
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
                            modLoadingArm.Remarks === null ? "" : modLoadingArm.Remarks
                        }
                        label={t("Cust_Remarks")}
                        onChange={(data) => onFieldChange("Remarks", data)}
                        indicator={
                            modLoadingArm.Status !== loadingArm.Status ? "required" : ""
                        }
                        error={t(validationErrors.Remarks)}
                        reserveSpace={false}
                    />
                </div>
                {IsDualBay === true ?
                    <div className="col-12 col-md-6 col-lg-4">
                        <Select
                            fluid
                            placeholder={t("Common_Select")}
                            label={t("LoadingArm_SelectAssociatedBay")}
                            value={modLoadingArm.AssociatedBay}
                            options={Constants.associatedBayOptions}
                            onChange={(data) => onFieldChange("AssociatedBay", data)}
                            indicator="required"
                            disabled={modLoadingArm.Swingable === true ? true : false}
                            reserveSpace={false}
                            search={false}
                            noResultsMessage={t("noResultsMessage")}
                        />
                    </div> : ""
                }
                {
                    ((modLoadingArm.ArmLoadingType === "LOADING" || modLoadingArm.ArmLoadingType === "BOTH") && deviceModel !== Constants.DeviceModels.Microload) ?
                        <div className="col-12 col-md-6 col-lg-4 ">
                            <Checkbox className="deviceDualandTransCheckBox"
                                label={t("Loadingarm_Swingable")}
                                checked={modLoadingArm.Swingable}
                                onChange={(data) => onFieldChange("Swingable", data)}
                            >
                            </Checkbox>

                        </div> : null
                }
                {
                    (modLoadingArm.Swingable && !IsDualBay && deviceModel !== Constants.DeviceModels.Microload) ? (
                        <div className='col-12'>
                            <h5>{t("LoadingArms_SwingArmAssociations")}</h5>
                            <DataTable
                                data={possibleSwingArmList}
                                selectionMode="multiple"
                                scrollable={true}
                                selection={selectedSwingArmAssociations}
                                onSelectionChange={onSwingArmAssociationSelectionChange}
                                onSelectAll={onSwingArmAssociationSelectionChange}
                                className="swing-arm-association"
                                scrollHeight="100px">
                                <DataTable.Column
                                    header={t("BCU_Code")}
                                    key="BCUCode"
                                    field="BCUCode" />
                                <DataTable.Column
                                    header={t("LoadingArmCode")}
                                    key="LoadArmCode"
                                    field="LoadArmCode" />
                            </DataTable>
                        </div>
                    ) : null
                }
                <div className="col-12 pb-0">
                    {
                        selectedAttributeList.length > 0 ?
                            selectedAttributeList.map((attire) =>
                                <div className='bayAccordian'>
                                    <ErrorBoundary>
                                        <Accordion className=''>
                                            <Accordion.Content
                                                // className="attributeAccordian"
                                                title={t("Attributes_Header")}
                                            >
                                                <AttributeDetails
                                                    selectedAttributeList={attire.attributeMetaDataList}
                                                    handleCellDataEdit={handleAttributeCellDataEdit}
                                                    attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attire.TerminalCode)}
                                                ></AttributeDetails>
                                            </Accordion.Content>
                                        </Accordion>
                                    </ErrorBoundary>
                                </div>
                            ) : null

                    }
                </div>


                <div className="col-12 pb-0 pt-3">
                    <h5>{t("BCU_FP")}</h5>
                    <DataTable
                        data={modAssociations}
                        selectionMode="multiple"
                        selection={selectedRows}
                        onSelectionChange={handleRowSelectionChange}
                        scrollable={true}
                        scrollHeight="100px"
                    >
                        <DataTable.Column
                            className="compColHeight"
                            key="Shareholdercode"
                            field="Shareholdercode"
                            header={t("BCU_shareHolder")}
                            sortable={true}
                            editFieldType="text"
                            customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>
                        <DataTable.Column
                            className="compColHeight"
                            key="Code"
                            field="Code"
                            header={t("LoadingArm_FinishedProduct")}
                            sortable={true}
                            editFieldType="text"
                            customEditRenderer={handleCustomEditTextBox}
                        ></DataTable.Column>
                    </DataTable>
                </div>

            </div>
        </div >
    );
}

