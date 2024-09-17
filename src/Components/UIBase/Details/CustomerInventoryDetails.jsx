import React from "react";
import { DatePicker, Button } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

CustomerInventoryDetails.propTypes = {
    customerCode: PropTypes.string.isRequired,
    baseproductCode: PropTypes.string.isRequired,
    inventorySummaryInfo : PropTypes.object.isRequired,
    dateRange: PropTypes.object.isRequired,
    handleDateTextChange: PropTypes.func.isRequired,
    handleRangeSelect: PropTypes.func.isRequired,
    dateError: PropTypes.string.isRequired,
    closedReceipt: PropTypes.array.isRequired,
    closedDispatch: PropTypes.array.isRequired,
    activeDispatch: PropTypes.array.isRequired,
    handleLoadInventory: PropTypes.func.isRequired,
    pageSize: PropTypes.number,
    totalUnloadedQty: PropTypes.number,
    totalLoadedQty: PropTypes.number,
     totalBlockedQty: PropTypes.number,
}

CustomerInventoryDetails.defaultProps = {
};

export function CustomerInventoryDetails({
    customerCode,
    baseproductCode,
    inventorySummaryInfo,
    dateRange,
    handleDateTextChange,
    handleRangeSelect,
    dateError,
    closedReceipt,
    closedDispatch,
    activeDispatch,
    handleLoadInventory,
    pageSize,
    totalUnloadedQty,
    totalLoadedQty,
    totalBlockedQty
}) {
    return (
        <TranslationConsumer>
            {(t) => (
                <div>
                <div className="headerContainer">
                    <div className="row headerSpacing">
                        <div className="col paddingHeaderItemLeft">
                            <span style={{ margin: "auto" }} className="headerLabel">
                {t("CustomerInventory_Title").replace("{0}",customerCode).replace("{1}",baseproductCode)}
              </span>
                        </div>
                </div>
                </div>
                <div className="detailsContainer">
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-12">
                                <h5>{t("CustomerInventory_QtyAsOfNow") + ": "+inventorySummaryInfo.GrossAvailableQty +""+inventorySummaryInfo.QuantityUOM}</h5>
                            </div>
                        </div>
                        <div className="row" style={{marginLeft:"1px"}}>
                            <div className="dateRangeContainer">
                            <div className="dateRangeMargin">
            <DatePicker
              type="daterange"
              closeOnSelection={true}
              error={t(dateError)}
              displayFormat={getCurrentDateFormat()}
              rangeValue={dateRange}
              onTextChange={handleDateTextChange}
              onRangeSelect={handleRangeSelect}
              reserveSpace={false}
            />
          </div>
          <div className="dateSearch">
                                <Button content={t("ProductAllocation_Go")}  onClick={handleLoadInventory} />
                               
                                </div>
                            </div>
                        </div>

                        <div className="row customerInventoryGridRow">
                            <div className="col-12 col-md-12 col-lg-4">
                                {closedReceipt.length > 0 ?
                                    <h5>{t("CustomerInventory_ClosedReceipts") + " (" + t("CustomerInventory_TotalUnloadedQty") +" : "+ totalUnloadedQty + inventorySummaryInfo.QuantityUOM + ")"}</h5> :
                                    <h5>{t("CustomerInventory_ClosedReceipts")}</h5>
                                }
                                     <div className="tableScroll  flexRelative">
                                    <DataTable
                                        data={closedReceipt}
                                     search={false}>
                                        <DataTable.Column
                                className="compColHeight"
                                key="ReceiptCode"
                                field="ReceiptCode"
                                header={t("Report_ReceiptCode")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                        <DataTable.Column
                                className="compColHeight"
                                key="UnloadedTime"
                                field="UnloadedTime"
                                header={t("UnloadedDate")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                        <DataTable.Column
                                className="compColHeight"
                                key="PlannedQuantity"
                                field="PlannedQuantity"
                                header={t("ViewReceipt_Quantity")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                        <DataTable.Column
                                className="compColHeight"
                                key="UnloadedQuantity"
                                field="UnloadedQuantity"
                                header={t("UnLoadingInfo_UnloadQuantity")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                         {Array.isArray(closedReceipt) &&
                                    closedReceipt.length > pageSize ? (
                      <DataTable.Pagination />) : ("")}
                                    </DataTable>
                                    </div>
                               
                            </div>
                            <div className="col-12 col-md-12 col-lg-4">
                                 {closedDispatch.length > 0 ?
                                    <h5>{t("CustomerInventory_ClosedDispatches") + " (" + t("CustomerInventory_TotalLoadedQty") +" : "+ totalLoadedQty + inventorySummaryInfo.QuantityUOM + ")"}</h5> :
                                     <h5>{t("CustomerInventory_ClosedDispatches")}</h5>
                                }
                                <div className="tableScroll  flexRelative">
                                    <DataTable
                                    data={closedDispatch}
                                        search={false}>
                                             <DataTable.Column
                                className="compColHeight"
                                key="DispatchCode"
                                field="DispatchCode"
                                header={t("PipelineDispatch_DispatchCode")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                        <DataTable.Column
                                className="compColHeight"
                                key="LoadedTime"
                                field="LoadedTime"
                                header={t("ShipmentByCompartmentList_LoadedDate")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                        <DataTable.Column
                                className="compColHeight"
                                key="PlannedQuantity"
                                field="PlannedQuantity"
                                header={t("ViewReceipt_Quantity")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                        <DataTable.Column
                                className="compColHeight"
                                key="LoadedQuantity"
                                field="LoadedQuantity"
                                header={t("ShipmentOrder_LoadedQuantity")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                         {Array.isArray(closedDispatch) &&
                                    closedDispatch.length > pageSize ? (
                      <DataTable.Pagination />) : ("")}
                                    </DataTable>

                                </div>

                            </div>
                            <div className="col-12 col-md-12 col-lg-4">
                                {activeDispatch.length > 0 ?
                                    <h5>{t("CustomerInventory_ActiveDispatches") + " (" + t("CustomerInventory_TotalBlockedQty") +" : "+ totalBlockedQty + inventorySummaryInfo.QuantityUOM + ")"}</h5> :
                                      <h5>{t("CustomerInventory_ActiveDispatches")}</h5>
                                }
                                <div className="tableScroll flexRelative">
                                    <DataTable
                                    data={activeDispatch}
                                        search={false}>
                                         <DataTable.Column
                                className="compColHeight"
                                key="DispatchCode"
                                field="DispatchCode"
                                header={t("PipelineDispatch_DispatchCode")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                         <DataTable.Column
                                className="compColHeight"
                                key="ScheduledDate"
                                field="ScheduledDate"
                                header={t("ShipmentProdDetail_ScheduledDate")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                         <DataTable.Column
                                className="compColHeight"
                                key="PlannedQuantity"
                                field="PlannedQuantity"
                                header={t("ProductAllocationItemInfo_BlockedQty")}
                                editFieldType="text"
                                        ></DataTable.Column>
                                             {Array.isArray(activeDispatch) &&
                                    activeDispatch.length > pageSize ? (
                      <DataTable.Pagination />) : ("")}
                                    </DataTable>

                                </div>

                            </div>

                        </div>

                        <div className="row" style={{ marginLeft: "1px" }}>
                            <div className="dateRangeContainer">
                                {t("CustomerInventory_LegendContent")}
                            </div>
                        </div>
                        
                    </div>
                    </div>
            )}
        </TranslationConsumer>
    )
}