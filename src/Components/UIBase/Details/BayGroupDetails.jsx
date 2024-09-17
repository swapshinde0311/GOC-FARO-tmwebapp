import React from "react";
import { Input,Icon } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";

BayGroupDetails.propTypes = {
    bayGroup: PropTypes.object.isRequired,
    modBayGroup: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    modAvailablebayList: PropTypes.object.isRequired,
    handleBaySelectionChange: PropTypes.func.isRequired,
    selectedbays:PropTypes.array.isRequired
}

BayGroupDetails.defaultProps = {
    isEnterpriseNode: false,
}

export default function BayGroupDetails({
    bayGroup,
    modBayGroup,
    validationErrors,
    onFieldChange,
    modAvailablebayList,
    handleBaySelectionChange,
    selectedbays
}) {
    function displayValues(cellData) {
        const { value, field } = cellData;
        if (typeof value === "boolean" || field === "Active") {
            if (value) return <Icon name="check" size="small" color="green" />;
            else return <Icon name="close" size="small" color="red" />;
        }
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
                                value={modBayGroup.GroupName}
                                indicator="required"
                                disabled={bayGroup.GroupName !==""}
                                onChange={(data) => onFieldChange("GroupName", data)}
                                label={t("BayGroupList_Name")}
                                error={t(validationErrors.GroupName)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modBayGroup.Description}
                                onChange={(data) => onFieldChange("Description", data)}
                                label={t("BayGroupList_Description")}
                                error={t(validationErrors.Description)}
                                reserveSpace={false}
                            />
                        </div>
                            <div className="col-12 bayGroupList tableScroll">
                                <span>{t("BayGroupDetails_AssociatedBays")}</span>
                        <div class="ui red circular empty label badge  circle-padding" />
                            <DataTable
                            data={modAvailablebayList}
                            selectionMode="multiple"
                              selection={selectedbays}
                              onSelectionChange={handleBaySelectionChange}
                            scrollable={true}
                            scrollHeight="320px"
                                >
                            <DataTable.Column
                            className="compColHeight"
                            key="BayCode"
                            field="BayCode"
                            header={t("BayGroupList_BayCode")}
                             ></DataTable.Column>
                               <DataTable.Column
                            className="compColHeight"
                            key="Description"
                            field="Description"
                            header={t("BayGroupList_Description")}
                              ></DataTable.Column>
                              <DataTable.Column
                            className="compColHeight"
                            key="LoadingType"
                            field="LoadingType"
                            header={t("BayGroupList_LoadingType")}
                             ></DataTable.Column>
                             <DataTable.Column
                            className="compColHeight"
                            key="MaximumQueue"
                            field="MaximumQueue"
                            header={t("BayGroupList_MaximumQueue")}
                             ></DataTable.Column>
                             <DataTable.Column
                            className="compColHeight"
                            key="Active"
                            field="Active"
                            header={t("BayGroupList_Active")}
                            renderer={(cellData)=>displayValues(cellData)}
                            ></DataTable.Column>
                            </DataTable>
                                </div>
                            
                    </div>
                </div>
            )}
        </TranslationConsumer>
    )
}

