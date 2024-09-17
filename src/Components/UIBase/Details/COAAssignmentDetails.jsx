import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";
import PropTypes from "prop-types";
import { Select, Input, Icon, Accordion } from "@scuf/common";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import { AttributeDetails } from "../Details/AttributeDetails";
import { Button } from "@scuf/common";

COAAssignmentDetails.propTypes = {
  coaAssignment: PropTypes.object.isRequired,
  modCOAAssignment: PropTypes.object.isRequired,
  selectvalidationErrorslist: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    compartmentList: PropTypes.array,
    tankCodes: PropTypes.array,
    baseCOACodes: PropTypes.array,
    bayCodes: PropTypes.array,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleTankCodeChange: PropTypes.func.isRequired,
  handleBaseCOAChange: PropTypes.func.isRequired,
  setCurrentList: PropTypes.func.isRequired,
  handleAddCompartmentDetail: PropTypes.func.isRequired,
  handleDeleteCompartmentDetail: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  attributeValidationListErrors: PropTypes.object.isRequired,
  modAttributeMetaDataLists: PropTypes.array,
  attributeMetaDataLists: PropTypes.array,
  onAttributeDataChange: PropTypes.func.isRequired,
  selectCompartment: PropTypes.object.isRequired,
  AddEnable: PropTypes.bool.isRequired,
  DeleteEnable: PropTypes.bool.isRequired,
};

export function COAAssignmentDetails({
  coaAssignment,
  modCOAAssignment,
  selectvalidationErrorslist,
  listOptions,
  onFieldChange,
  handleCellDataEdit,
  setCurrentList,
  handleAddCompartmentDetail,
  handleDeleteCompartmentDetail,
  handleTankCodeChange,
  handleBaseCOAChange,
  pageSize,
  attributeValidationListErrors,
  modAttributeMetaDataLists,
  attributeMetaDataLists,
  onAttributeDataChange,
  selectCompartment,
  AddEnable,
  DeleteEnable,
}) {
  const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
    let attributeValidation = [];
    attributeValidation = attributeValidationErrors.find(
      (selectedAttribute) => {
        return selectedAttribute.TerminalCode === terminal;
      }
    );
    return attributeValidation.attributeValidationErrors;
  };

  const handleCustomEditTextBox = (cellData, index) => {
    return (
      <Input
        fluid
        value={cellData.rowData[cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData, index)}
        reserveSpace={false}
      />
    );
  };

  const CompartmentIndex =
    modCOAAssignment.COATransactionCompartments.findIndex((ele) => {
      return (
        ele.CompartmentSeqNumber === selectCompartment.CompartmentSeqNumber
      );
    });

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6">
              <label className="TransloadingheaderLabel COAAssignment-TagName">
                {t("COAAssignment_TransactionDetails")}
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("COAAssignment_TransactionCode")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{modCOAAssignment.TransactionCode}</label>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("COAAssignment_TransactionStatus")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{modCOAAssignment.TransactionStatus}</label>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("COAAssignment_TransportationType")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{modCOAAssignment.TransportationType}</label>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label className="TransloadingheaderLabel">
                {t("COAAssignment_TransactionType")}
              </label>
              <label>:</label>
              <label> </label>
              <label>{modCOAAssignment.TransactionType}</label>
            </div>
          </div>

          <div
            className="row COAAssignment-Contener"
            style={{ alignItems: "stretch" }}
          >
            <div
              className="col-12 col-md-6 col-lg-2"
              style={{ border: "1px solid #c8c8c8", minHeight: "400px" }}
            >
              <div>
                <label className="headerLabel">
                  {t("COAAssignmentView_Compartments")}
                </label>
              </div>

              <ul>
                {modCOAAssignment.COATransactionCompartments.map((item, n) => {
                  return (
                    <li
                      className={
                        item.CompartmentSeqNumber ===
                          selectCompartment.CompartmentSeqNumber
                          ? "activeted"
                          : ""
                      }
                      onClick={(e) => setCurrentList(item, n)}
                      key={item.CompartmentSeqNumber}
                    >
                      {item.CompartmentSeqNumber +
                        "." +
                        item.FinishedProductCode +
                        "(" +
                        item.COATransactionCompartmentDetails.length +
                        ")"}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-12 col-md-6 col-lg-10">
              <div class="row COAAssignment-Contener-Margin border-bottom-1">
                <div className="col-12 col-md-4 col-lg-8 COAAssignment-Contener-Padding">
                  <div class="row">
                    <div className="col-12 col-md-4 col-lg-6">
                      <label className="TransloadingheaderLabel">
                        {t("COAViewComapartment_CompartmentSeqNumber")}
                      </label>
                      <label>:</label>
                      <label> </label>
                      <label>{selectCompartment.CompartmentSeqNumber}</label>
                    </div>
                    <div className="col-12 col-md-4 col-lg-6">
                      <label className="TransloadingheaderLabel">
                        {t("COAViewComapartment_FinishedProductCode")}
                      </label>
                      <label>:</label>
                      <label> </label>
                      <label>{selectCompartment.FinishedProductCode}</label>
                    </div>
                  </div>
                  <div class="row">
                    <div className="col-12 col-md-4 col-lg-6">
                      <label className="TransloadingheaderLabel">
                        {t("COAViewComapartment_CustomerCode")}
                      </label>
                      <label>:</label>
                      <label> </label>
                      <label>{selectCompartment.CustomerCode}</label>
                    </div>
                    <div className="col-12 col-md-4 col-lg-6">
                      <label className="TransloadingheaderLabel">
                        {t("COAViewComapartment_DestinationCode")}
                      </label>
                      <label>:</label>
                      <label> </label>
                      <label>{selectCompartment.DestinationCode}</label>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4 col-lg-2">
                  <Button
                    disabled={!AddEnable}
                    onClick={(e) => handleAddCompartmentDetail()}
                    content={t("COAAssignment_AddCOA")}
                  ></Button>
                </div>

                {modAttributeMetaDataLists[CompartmentIndex].COAASSIGNMENT
                  .length > 0
                  ? modAttributeMetaDataLists[
                      CompartmentIndex
                    ].COAASSIGNMENT.map((attire) => (
                      <ErrorBoundary>
                        <Accordion>
                          <Accordion.Content
                            className="attributeAccordian"
                            title={t("Attributes_Header")}
                          >
                            <AttributeDetails
                              selectedAttributeList={
                                attire.attributeMetaDataList
                              }
                              handleCellDataEdit={onAttributeDataChange}
                              attributeValidationErrors={handleValidationErrorFilter(
                                attributeValidationListErrors[CompartmentIndex],
                                attire.TerminalCode
                              )}
                            ></AttributeDetails>
                          </Accordion.Content>
                        </Accordion>
                      </ErrorBoundary>
                    ))
                  : null}
              </div>

              <div className="row">
                {selectCompartment.COATransactionCompartmentDetails !== null
                  ? selectCompartment.COATransactionCompartmentDetails.map(
                      (compartDetail, i) => {
                        return (
                          <div className="col-12 detailsTable COAAssignment-Contener">
                            <div className="row COAAssignment-Contener-Margin ">
                              <div className="col-12">
                                <div
                                  onClick={() =>
                                    DeleteEnable
                                      ? handleDeleteCompartmentDetail(i)
                                      : null
                                  }
                                  className={
                                    (DeleteEnable
                                      ? "iconCircle "
                                      : "iconCircleDisable ") + "iconblock"
                                  }
                                  style={{ float: "right" }}
                                >
                                  <div>
                                    <Icon
                                      root="common"
                                      name="delete"
                                      size="small"
                                      color="white"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                  fluid
                                  placeholder="Select"
                                  indicator="required"
                                  value={compartDetail.BayCode}
                                  text={compartDetail.BayCode}
                                  label={t("COACompartmentDetails_BayCode")}
                                  options={Utilities.transferListtoOptions(
                                    listOptions.bayCodes
                                  )}
                                  onChange={(data) =>
                                    onFieldChange("BayCode", data, i)
                                  }
                                  error={t(
                                    selectvalidationErrorslist.length > i &&
                                      selectvalidationErrorslist[i] !==
                                        undefined
                                      ? selectvalidationErrorslist[i].BayCode
                                      : ""
                                  )}
                                  disabled={
                                    compartDetail.ID !== null &&
                                    compartDetail.ID !== ""
                                  }
                                  multiple={false}
                                  reserveSpace={false}
                                  search={true}
                                  noResultsMessage={t("noResultsMessage")}
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                  fluid
                                  placeholder="Select"
                                  indicator="required"
                                  value={compartDetail.TankCode}
                                  text={compartDetail.TankCode}
                                  label={t("COACompartmentDetails_TankCode")}
                                  options={Utilities.transferListtoOptions(
                                    listOptions.tankCodes
                                  )}
                                  onChange={(data) =>
                                    handleTankCodeChange(data, i)
                                  }
                                  error={t(
                                    selectvalidationErrorslist[i].TankCode
                                  )}
                                  disabled={
                                    compartDetail.ID !== null &&
                                    compartDetail.ID !== ""
                                  }
                                  multiple={false}
                                  reserveSpace={false}
                                  search={true}
                                  noResultsMessage={t("noResultsMessage")}
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-4">
                                <Select
                                  fluid
                                  placeholder="Select"
                                  indicator="required"
                                  value={compartDetail.BaseCOACode}
                                  text={compartDetail.BaseCOACode}
                                  label={t("COACompartmentDetails_BaseCOACode")}
                                  options={Utilities.transferListtoOptions(
                                    listOptions.baseCOACodes
                                  )}
                                  onChange={(data) =>
                                    handleBaseCOAChange(data, i)
                                  }
                                  error={t(
                                    selectvalidationErrorslist[i].BaseCOACode
                                  )}
                                  disabled={
                                    compartDetail.ID !== null &&
                                    compartDetail.ID !== ""
                                  }
                                  multiple={false}
                                  reserveSpace={false}
                                  search={true}
                                  noResultsMessage={t("noResultsMessage")}
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-4">
                                <Input
                                  fluid
                                  value={compartDetail.BaseCOANumber}
                                  label={t(
                                    "COACompartmentDetails_BaseCOANumber"
                                  )}
                                  disabled={true}
                                  onChange={(data) =>
                                    onFieldChange("BaseCOANumber", data, i)
                                  }
                                  error={t(
                                    selectvalidationErrorslist[i].BaseCOANumber
                                  )}
                                  reserveSpace={false}
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-4">
                                <Input
                                  fluid
                                  value={
                                    compartDetail.FinishedProductCOACode ===
                                    null
                                      ? ""
                                      : compartDetail.FinishedProductCOACode
                                  }
                                  label={t(
                                    "COACompartmentDetails_FinishedProductCOACode"
                                  )}
                                  disabled={false}
                                  onChange={(data) =>
                                    onFieldChange(
                                      "FinishedProductCOACode",
                                      data,
                                      i
                                    )
                                  }
                                  error={t(
                                    selectvalidationErrorslist[i]
                                      .FinishedProductCOACode
                                  )}
                                  reserveSpace={false}
                                />
                              </div>
                              <div className="col-12 col-md-6 col-lg-4">
                                <Input
                                  fluid
                                  value={
                                    compartDetail.FinishedProductCOANumber ===
                                    null
                                      ? ""
                                      : compartDetail.FinishedProductCOANumber
                                  }
                                  label={t(
                                    "COACompartmentDetails_FinishedProductCOANumber"
                                  )}
                                  disabled={false}
                                  onChange={(data) =>
                                    onFieldChange(
                                      "FinishedProductCOANumber",
                                      data,
                                      i
                                    )
                                  }
                                  error={t(
                                    selectvalidationErrorslist[i]
                                      .FinishedProductCOANumber
                                  )}
                                  reserveSpace={false}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 col-md-12 col-lg-12">
                                <div className="detailsTable">
                                  <DataTable
                                    data={
                                      compartDetail.COATransactionCompartmentDetailParameterInfos
                                    }
                                    search={true}
                                    rows={pageSize}
                                    searchPlaceholder={t(
                                      "LoadingDetailsView_SearchGrid"
                                    )}
                                  >
                                    <DataTable.Column
                                      className="compColHeight"
                                      key="Name"
                                      field="Name"
                                      header={t(
                                        "COAAssignmentDetail_ParameterName"
                                      )}
                                    ></DataTable.Column>
                                    <DataTable.Column
                                      className="compColHeight"
                                      key="Specification"
                                      field="Specification"
                                      header={t(
                                        "COAAssignmentDetail_Specification"
                                      )}
                                      editFieldType="text"
                                      editable={true}
                                      customEditRenderer={(cellData) =>
                                        handleCustomEditTextBox(cellData, i)
                                      }
                                    ></DataTable.Column>
                                    <DataTable.Column
                                      className="compColHeight"
                                      key="Method"
                                      field="Method"
                                      header={t("COAAssignmentDetail_Method")}
                                      editFieldType="text"
                                      editable={true}
                                      customEditRenderer={(cellData) =>
                                        handleCustomEditTextBox(cellData, i)
                                      }
                                    ></DataTable.Column>
                                    <DataTable.Column
                                      className="compColHeight"
                                      key="Result"
                                      field="Result"
                                      header={t("COAAssignmentDetail_Result")}
                                      editFieldType="text"
                                      editable={true}
                                      customEditRenderer={(cellData) =>
                                        handleCustomEditTextBox(cellData, i)
                                      }
                                    ></DataTable.Column>
                                    <DataTable.Column
                                      className="compColHeight"
                                      key="Sortindex"
                                      field="Sortindex"
                                      header={t(
                                        "COAAssignmentDetail_SortIndex"
                                      )}
                                      editFieldType="text"
                                      editable={true}
                                      customEditRenderer={(cellData) =>
                                        handleCustomEditTextBox(cellData, i)
                                      }
                                    ></DataTable.Column>
                                    {Array.isArray(
                                      compartDetail.COATransactionCompartmentDetailParameterInfos
                                    ) &&
                                    compartDetail
                                      .COATransactionCompartmentDetailParameterInfos
                                      .length > pageSize ? (
                                      <DataTable.Pagination />
                                    ) : (
                                      ""
                                    )}
                                  </DataTable>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
