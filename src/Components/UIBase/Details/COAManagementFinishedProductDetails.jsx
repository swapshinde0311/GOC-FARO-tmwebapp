import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import { DataTable } from "@scuf/datatable";
import { Select,Input, Accordion } from "@scuf/common";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";

COAManagementFinishedProductDetails.propTypes = {
  coaManagementFinishedProduct: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    templateParameters:PropTypes.array,
  }).isRequired,
  pageSize: PropTypes.number,
};

COAManagementFinishedProductDetails.defaultProps = {
  templateParameters:[],
};



export function COAManagementFinishedProductDetails({
  coaManagementFinishedProduct,
  listOptions,
  pageSize,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={coaManagementFinishedProduct.COACode}
                label={t("COAManagementFinishedProductCode")}
                indicator="required"
                disabled={true}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
            <Input
                fluid
                value={coaManagementFinishedProduct.FinishedProductCode}
                label={t("COAManagementFinishedProductFinishedProductCode")}
                disabled={true}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
            <Input
                fluid
                value={coaManagementFinishedProduct.FinishedProductName}
                label={t("COAManagementFinishedProductFinishedProductName")}
                disabled={true}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
            <Input
                fluid
                value={coaManagementFinishedProduct.LOTNumber}
                label={t("COAManagementFinishedProductLOTNumber")}
                disabled={true}
                reserveSpace={false}
              />
            </div>
          </div>
          <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                            <h4>{t("COAManagementFinishedProduct_Configuration")}</h4>
                            <div className="detailsTable">
                                <DataTable
                                    data={listOptions.templateParameters}
                                    search={true}
                                    rows={pageSize}
                                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="ParameterName"
                                        field="ParameterName"
                                        header={t("COAManagementDetail_ParameterName")}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="Specification"
                                        field="Specification"
                                        header={t("COAManagementDetail_Specification")}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="Method"
                                        field="Method"
                                        header={t("COAManagementDetail_Method")}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="Result"
                                        field="Result"
                                        header={t("COAManagementDetail_Result")}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                        className="compColHeight"
                                        key="SortIndex"
                                        field="SortIndex"
                                        header={t("COAManagementDetail_SortIndex")}
                                    ></DataTable.Column>
                                    {Array.isArray(listOptions.templateParameters) &&
                                        listOptions.templateParameters.length > pageSize ? (
                                        <DataTable.Pagination />) : ("")}
                                </DataTable>
                            </div>
                        </div>
                        <div>

                        </div>

                    </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
