import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
import * as Constants from "../../../JS/Constants";

ShareholderAllocationItemDetails.propTypes = {
    allocationItemList: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
    pageSize: PropTypes.number,
    allocationType: PropTypes.string.isRequired
};

ShareholderAllocationItemDetails.defaultProps = {};

export function ShareholderAllocationItemDetails({
    allocationItemList,
    handleBack,
    pageSize,
    allocationType
}) {

    return (
        <div>
            <TranslationConsumer>
                {(t) => (
                    <div>
                        <div className="detailsContainer">
                            <div id="printTable">
                                <div className="row">
                                    <div className="col-12">
                                        <h3>
                                            {allocationType
                                                === Constants.AllocationEntityType.SHAREHOLDER ? t("ProductAllocationItemDetails_Shareholder_Header")
                                                : allocationType === Constants.AllocationEntityType.CUSTOMER ?
                                                    t("ProductAllocationItemDetails_Customer_Header") :
                                                    t("ProductAllocationItemDetails_CarrierCompany_Header")}
                                        </h3>
                                    </div>
                                </div>

                                <div className="row marginRightZero tableScroll">
                                    <div className="col-12 detailsTable ">
                                        <DataTable
                                            data={allocationItemList}
                                            reorderableColumns={true}
                                            resizableColumns={true}
                                            search={true}
                                            searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                                            rows={pageSize}
                                        >
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="productcode"
                                                field="productcode"
                                                header={t("MarineShipmentProductAllocationDetails_ProductCode")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="allocationtype"
                                                field="allocationtype"
                                                header={t("MarineShipmentProductAllocationDetails_AllocationType")}
                                                editable={false}
                                                editFieldType="text"
                                            //renderer={(cellData) => disPlayValue(cellData)}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="allocationperiod"
                                                field="allocationperiod"
                                                header={t("MarineShipmentProductAllocationDetails_AllocationFrequency")}
                                                editable={false}
                                                editFieldType="text"
                                            //renderer={(cellData) => disPlayValue(cellData)}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="startdate"
                                                field="startdate"
                                                header={t("MarineShipmentProductAllocationDetails_StartDate")}
                                                editable={false}
                                                editFieldType="text"
                                            //renderer={(cellData) => disPlayValue(cellData)}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="enddate"
                                                field="enddate"
                                                header={t("MarineShipmentProductAllocationDetails_EndDate")}
                                                editable={false}
                                                editFieldType="text"
                                            //renderer={(cellData) => disPlayValue(cellData)}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="allocatedqty"
                                                field="allocatedqty"
                                                header={t("MarineShipmentProductAllocationDetails_AllocatedQuantity")}
                                                editable={false}
                                                editFieldType="text"
                                            //renderer={(cellData) => disPlayValue(cellData)}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="blockedqty"
                                                field="blockedqty"
                                                header={t("MarineShipmentProductAllocationDetails_BlockedQuantity")}
                                                editable={false}
                                                editFieldType="text"
                                            //renderer={(cellData) => disPlayValue(cellData)}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="loadedqty"
                                                field="loadedqty"
                                                header={t("MarineShipmentProductAllocationDetails_LoadedQuantity")}
                                                editable={false}
                                                editFieldType="text"
                                            //renderer={(cellData) => disPlayValue(cellData)}
                                            ></DataTable.Column>
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-sm-6 col-lg-8">
                                    <Button
                                        className="backButton"
                                        onClick={handleBack}
                                        content={t("Back")}
                                    ></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </TranslationConsumer>
        </div>
    );
}
