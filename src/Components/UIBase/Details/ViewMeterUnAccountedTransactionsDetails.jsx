import React from "react";
import PropTypes from "prop-types";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
import { DataTable } from "@scuf/datatable";

ViewMeterUnAccountedTransactionsDetails.propTypes = {
    transactionData: PropTypes.array.isRequired,
    handleBack: PropTypes.func.isRequired,
    pageSize: PropTypes.number
};

ViewMeterUnAccountedTransactionsDetails.defaultProps = {};

export function ViewMeterUnAccountedTransactionsDetails({
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
                                            {t("MeterUnaccountedTransaction_Header")}
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
                                                key="MeterUnaccountedTransaction_MeterCode"
                                                field="MeterUnaccountedTransaction_MeterCode"
                                                header={t("MeterUnaccountedTransaction_MeterCode")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="MeterUnaccountedTransaction_TankCode"
                                                field="MeterUnaccountedTransaction_TankCode"
                                                header={t("MeterUnaccountedTransaction_TankCode")}
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
                                                key="MeterUnaccountedTransaction_BPCode"
                                                field="MeterUnaccountedTransaction_BPCode"
                                                header={t("MeterUnaccountedTransaction_BPCode")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="MeterUnaccountedTransaction_Type"
                                                field="MeterUnaccountedTransaction_Type"
                                                header={t("MeterUnaccountedTransaction_Type")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="MeterUnaccountedTransaction_UnAccountedGrossQuantity"
                                                field="MeterUnaccountedTransaction_UnAccountedGrossQuantity"
                                                header={t("MeterUnaccountedTransaction_UnAccountedGrossQuantity")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="MeterUnaccountedTransaction_UnAccountedNetQuantity"
                                                field="MeterUnaccountedTransaction_UnAccountedNetQuantity"
                                                header={t("MeterUnaccountedTransaction_UnAccountedNetQuantity")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="MeterUnaccountedTransaction_QuantityUOM"
                                                field="MeterUnaccountedTransaction_QuantityUOM"
                                                header={t("MeterUnaccountedTransaction_QuantityUOM")}
                                                editable={false}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                className="compColHeight"
                                                key="MeterUnaccountedTransaction_CreatedTime"
                                                field="MeterUnaccountedTransaction_CreatedTime"
                                                header={t("MeterUnaccountedTransaction_CreatedTime")}
                                                editable={false}
                                                editFieldType="text"
                                                renderer={(cellData) => new Date(cellData.value).toLocaleDateString()}
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
