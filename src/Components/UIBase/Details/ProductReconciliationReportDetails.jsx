import React from 'react';
import { Select, Input,Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import * as Constants from "../../../JS/Constants";
import * as Utilities from "../../../JS/Utilities";


ProductReconciliationReportDetails.propTypes = {
    reconciliationInfo: PropTypes.object.isRequired,
    modReconciliationInfo:PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        productReconciliationStatusOptions: PropTypes.array,
        
    }).isRequired,
    handleReconciliationStatusChange: PropTypes.func.isRequired,
    handleReopenReconciliation: PropTypes.func.isRequired,
    handleViewReport: PropTypes.func.isRequired,
    handleViewUnAccountedTransactions: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    
}

ProductReconciliationReportDetails.defaultProps = {
    listOptions: {
        productReconciliationStatusOptions: [],
    },
   
}


export function ProductReconciliationReportDetails({
    reconciliationInfo,
    modReconciliationInfo,
    validationErrors,
    onFieldChange,
    listOptions,
    handleReconciliationStatusChange,
    handleReopenReconciliation,
    handleViewReport,
    handleViewUnAccountedTransactions,
    handleReset,
    
 
}) {
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value={modReconciliationInfo.ReconciliationCode}
                                disabled= {true}
                                label={t("ReconciliationReportDetail_RcCode")}
                                error={t(validationErrors.Code)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value= {new Date(modReconciliationInfo.StartDate).toLocaleDateString() +
                                    " " +
                                   new Date(modReconciliationInfo.StartDate).toLocaleTimeString()}
                                disabled= {true}
                                label={t("ReconciliationReportDetail_StartDate")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                                
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value= {new Date(modReconciliationInfo.EndDate).toLocaleDateString() +
                                    " " +
                                   new Date(modReconciliationInfo.EndDate).toLocaleTimeString()}
                                disabled= {true}
                                label={t("ReconciliationReportDetail_EndDate")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                                
                            />
                        </div>
  
                         <div className= "col-12 col-md-6 col-lg-4">
                            <Select 
                                fluid
                                placeholder="Select"
                                value={modReconciliationInfo.Status}
                                label={t("ReconciliationReportDetail_Status")}
                                options={Utilities.transferListtoOptions(
                                    listOptions.productReconciliationStatusOptions
                                )}
                                onChange={(data) => handleReconciliationStatusChange(data)}
                                error={t(validationErrors.Status)}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                            />
                        </div> 
                       
                       
                        
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modReconciliationInfo.Remarks}
                                label={t("CaptainInfo_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modReconciliationInfo.Status !== reconciliationInfo.Status ? "required" : ""}
                                reserveSpace={false}
                                onChange={(data) => onFieldChange("Remarks", data)}
                            />
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modReconciliationInfo.ReportWarnings}
                                label={t("ReconciliationReportDetail_ReportProcessWarning")}
                                disabled={true}
                                error={t(validationErrors.ReportWarnings)}
                                reserveSpace={false}
                            />
                        </div>

                    </div>
                    
                    <div className="row userActionPosition">
                    <div className="col-12 col-md-3 col-lg-4">
                                <Button
                                    type="primary"
                                    onClick={() => handleViewReport()}
                                    content={t("ReconciliationReportDetail_btnViewReconcile")}
                                    disabled={false}
                                    ></Button>
                                    </div>
                                    <div className="col-12 col-md-3 col-lg-4">
                                <Button
                                    type="primary"
                                    content={t("ReconciliationReportDetail_btnUnAccountedTankTransaction")}
                                    disabled={reconciliationInfo.EntityTypeCode === "Meter" }
                                    onClick={() => handleViewUnAccountedTransactions()}
                                    ></Button>
                                    </div>
                                    <div className="col-12 col-md-3 col-lg-4">
                                    <Button
                                    type="primary"
                                    
                                    disabled={reconciliationInfo.EntityTypeCode === "Tank" }
                                    content={t("ReconciliationReportDetail_btnUnAccountedMeterTransaction")}

                                    onClick={() => handleViewUnAccountedTransactions()}

                                    ></Button>
                                    </div>
                                    <div className="col-12 col-md-3 col-lg-4">
                                     <Button
                                    type="primary"
                                  onClick={() => handleReopenReconciliation()}
                                    disabled={!(modReconciliationInfo.Status.toUpperCase()===Constants.ProductReconciliationReportStatus.Reconciled_Diff.toUpperCase())}
                                    content={t("ReconciliationReportDetail_btnManualReconcile")}
                                ></Button>

                                </div>
                            </div>  
                </div>
            )}
        </TranslationConsumer>
    )
}