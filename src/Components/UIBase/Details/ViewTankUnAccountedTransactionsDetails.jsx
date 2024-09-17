import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
import { DataTable } from "@scuf/datatable";

ViewTankUnAccountedTransactionsDetails.propTypes = {
    transactionData: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
    pageSize: PropTypes.number
};

ViewTankUnAccountedTransactionsDetails.defaultProps = {};

export function ViewTankUnAccountedTransactionsDetails({
    transactionData,
    handleBack,
    pageSize
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
                                            {t("TankUnaccountedTransaction_Header")}
                                        </h3>
                                    </div>
                                </div>

                                <div className="row marginRightZero tableScroll">
                                    <div className="col-12 detailsTable ">
                                        <DataTable
                                            data={transactionData}
                                            reorderableColumns={true}
                                            resizableColumns={true}
                                            search={true}
                                            searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                                            rows={pageSize}
                                        >
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_TankCode"
                                                field="TankUnaccountedTransaction_TankCode"
                                                header={t("TankUnaccountedTransaction_TankCode")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_BPCode"
                                                field="TankUnaccountedTransaction_BPCode"
                                                header={t("TankUnaccountedTransaction_BPCode")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="Vehicle_Transport"
                                                field="Vehicle_Transport"
                                                header={t("Vehicle_Transport")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_Type"
                                                field="TankUnaccountedTransaction_Type"
                                                header={t("TankUnaccountedTransaction_Type")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_UnAccountedGrossQuantity"
                                                field="TankUnaccountedTransaction_UnAccountedGrossQuantity"
                                                header={t("TankUnaccountedTransaction_UnAccountedGrossQuantity")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_UnAccountedNetQuantity"
                                                field="TankUnaccountedTransaction_UnAccountedNetQuantity"
                                                header={t("TankUnaccountedTransaction_UnAccountedNetQuantity")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_QuantityUOM"
                                                field="TankUnaccountedTransaction_QuantityUOM"
                                                header={t("TankUnaccountedTransaction_QuantityUOM")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_Density"
                                                field="TankUnaccountedTransaction_Density"
                                                header={t("TankUnaccountedTransaction_Density")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_DensityUOM"
                                                field="TankUnaccountedTransaction_DensityUOM"
                                                header={t("TankUnaccountedTransaction_DensityUOM")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_StartTime"
                                                field="TankUnaccountedTransaction_StartTime"
                                                header={t("TankUnaccountedTransaction_StartTime")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_EndTime"
                                                field="TankUnaccountedTransaction_EndTime"
                                                header={t("TankUnaccountedTransaction_EndTime")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="TankUnaccountedTransaction_CreatedTime"
                                                field="TankUnaccountedTransaction_CreatedTime"
                                                header={t("TankUnaccountedTransaction_CreatedTime")}
                                                editable={false}
                                                editFieldType="text"
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
