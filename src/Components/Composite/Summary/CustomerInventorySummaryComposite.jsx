import React from "react";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import { useTranslation } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import { Icon,Input,Pagination } from "@scuf/common";

CustomerInventorySummaryComposite.propTypes = {
    inventoryData: PropTypes.array.isRequired,
    detailsExpand: PropTypes.func.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    pageIndex: PropTypes.number.isRequired, 
    totalItem: PropTypes.number.isRequired, 
    pageChange: PropTypes.func.isRequired,
}

export function CustomerInventorySummaryComposite({
    inventoryData,
    detailsExpand,
    handleSearchChange,
    pageSize,
    itemsPerPage,
    pageIndex,
    totalItem,
    pageChange
}) {
    const [t] = useTranslation();
    const expanderTemplate = (customerCode,data) => {
        return (
      <div onClick={() => detailsExpand(customerCode,data)} className="compartmentIcon gridButtonFontColor">
        <ErrorBoundary>
          <Icon root="common" name={"ellipsis-horizontal"} className="margin_l10" />
        </ErrorBoundary>
        </div>
    );
  };

    return (
        <div className="detailsContainer">
            <div className="row">
                     <div className="col-12 col-md-3 col-lg-3">
                <Input className="input-example" placeholder={t("LoadingDetailsView_SearchGrid")} onChange={handleSearchChange} search={true} />
                </div> 
                <div className="col-12 col-md-3 col-lg-3 customerInventoryPagination">
                    {totalItem > itemsPerPage ? (
                     <Pagination
                        totalItems={totalItem}
                    itemsPerPage={itemsPerPage}
                           activePage={pageIndex}
                           onPageChange={(page) => pageChange(page)}>
                    </Pagination>
                ):("")}
                </div>
            </div>
            <div className="row">
                {inventoryData.length > 0 ? (inventoryData.map(function (item) {
                    return (
                        <ErrorBoundary>
                <div className="col-12 col-md-6 col-lg-4 col-sm-12">
                 <h4>{item.CustomerCode}</h4>
                            <div className="tableScroll  flexRelative">
                <DataTable
                    data={item.ProductList}
                search={false}>
            <DataTable.Column
              className="compColHeight"
              key="BaseProductCode"
              field="BaseProductCode"
              header={t("BaseProductInfo_BaseProdCode")}
                    ></DataTable.Column>
                     <DataTable.Column
              className="compColHeight"
              key="Quantity"
              field="Quantity"
              header={t("CustomerInventory_AvailableQty")}
                                        ></DataTable.Column>
                                        <DataTable.Column
                      className="compColHeight"
                      initialWidth="40px"
            renderer={(data) => expanderTemplate(item.CustomerCode,data)}
                    />
                    </DataTable>
                    </div>
                        </div>
                        </ErrorBoundary>)
            }
                )) : <div style={{marginLeft:"1px"}}>{(t("CustomerInventory_NoRecordsFound"))}</div>}
                </div>
        </div>
    )
}