import React, { useState } from "react";
import { DataTable } from "@scuf/datatable";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import { Button, Modal } from "@scuf/common";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
import {
  fnViewMarineUnloadingDetails,
  functionGroups,
} from "../../../JS/FunctionGroups";

MarineReceiptLoadingDetails.propTypes = {
  tableData: PropTypes.array,
  loadingDetailsHideFields: PropTypes.array,
  setValid: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  userDetails: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  isWebPortalUser: PropTypes.bool.isRequired,
};

MarineReceiptLoadingDetails.defaultProps = {};

export default function MarineReceiptLoadingDetails({
  tableData,
  loadingDetailsHideFields,
  setValid,
  handleBack,
  onSaved,
  userDetails,
  status,
  isWebPortalUser,
}) {
  const [t] = useTranslation();
  const [modelOpen, setModelOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState({});

  function displayTMModalforInValidConfirm() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={modelOpen} size="small">
            <Modal.Content>
              <div>
                <b>{t("InValid_Confirm")}</b>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                content={t("Cancel")}
                onClick={() => {
                  setModelOpen(false);
                  setLoadingDetail({});
                }}
              />
              <Button
                type="primary"
                content={t("Confirm")}
                onClick={() => {
                  setModelOpen(false);
                  setLoadingDetail({});
                  setValid(
                    loadingDetail.rowData.fptransactionid,
                    loadingDetail.rowData.ProductCategoryType
                  );
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  const handleCustom = (e) => {
    if (
      e.rowData.BaseProductCode == null ||
      e.rowData.BaseProductCode.toString().length === 0
    ) {
      return e.rowData.IsInvalid ? (
        <span>{t("ViewMarineUnloadingDetails_Invalid")}</span>
      ) : status !== "CLOSED" ? (
        <button className="ValidBtn" onClick={() => changeValid(e)}>
          {t("ViewMarineUnloadingDetails_Valid")}
        </button>
      ) : (
        <span>{t("ViewMarineLoadingDetails_Valid")}</span>
      );
    }
  };

  const changeValid = (e) => {
    Utilities.setArchive(userDetails.EntityResult.IsArchived);
    if (
      Utilities.isInFunction(
        userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnViewMarineUnloadingDetails
      )
    ) {
      setModelOpen(true);
      setLoadingDetail(e);
    } else {
      var notification = {
        messageType: "critical",
        message: "ReceiptCompDetail_Permission",
        messageResultDetails: [
          {
            keyFields: "",
            keyValues: "",
            isSuccess: false,
            errorMessage: "ReceiptCompDetail_UnloadingDetailsPermission",
          },
        ],
      };
      onSaved([], "Permission", notification);
    }
  };

  const formatDate = (e) => {
    const { value } = e;
    try {
      if (value == null || value.length === 0 || value === "") return "";
      return (
        new Date(value).toLocaleDateString() +
        " " +
        new Date(value).toLocaleTimeString()
      );
    } catch (error) {
      return value;
    }
  };

  const changeSpace = (e) => {
    const { value } = e;

    return value.replace(/&nbsp;/g, " ");
  };

  const changeNumber = (e) => {
    const { value } = e;
    try {
      if (value != null && value !== "") {
        var index = value.indexOf(" ");
        if (index === 0) {
          return "";
        }
        var str1 = value.substr(0, index);
        var str2 = value.substr(index + 1, value.length - index - 1);
        return parseFloat(str1).toLocaleString() + " " + str2;
      }
    } catch (error) {
      return value;
    }
    return "";
  };

  const changeNoSpaceNumber = (e) => {
    const { value } = e;
    try {
      if (value != null && value !== "") {
        return value.toLocaleString();
      }
    } catch (error) {
      return value;
    }
    return "";
  };

  return (
    <div>
      <div className="detailsContainer">
        <div className="row">
          <div className="col col-md-8 col-lg-9 col col-xl-9">
            <h3>{t("ViewMarineUnloadingDetails_Title")}</h3>
          </div>
          <div className="col col-md-8 col-lg-9 col col-xl-9">
            <h4>{t("ViewMarineUnloadingDetails_Header")}</h4>
          </div>
          <div className="detailsTable loadingTable">
            <DataTable
              data={tableData}
              scrollable={true}
              scrollWidth="100%"
              resizableColumns={true}
            >
              {loadingDetailsHideFields.indexOf("IsInvalid") > -1 ||
              isWebPortalUser ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="IsInvalid"
                  field="IsInvalid"
                  header={t("ViewMarineUnloadingDetails_Valid")}
                  initialWidth="90px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => handleCustom(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("CompartmentSeqNoInVehicle") >
              -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="CompartmentSeqNoInVehicle"
                  field="CompartmentSeqNoInVehicle"
                  header={t("ViewMarineUnloadingDetails_CompartmentSeqNo")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNoSpaceNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("ProductCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="ProductCode"
                  field="ProductCode"
                  header={t("ViewMarineUnloadingDetails_ProductCode")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeSpace(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("BaseProductCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="BaseProductCode"
                  field="BaseProductCode"
                  header={t("ViewMarineUnloadingDetails_BaseProductCode")}
                  initialWidth="170px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="TankCode"
                  field="TankCode"
                  header={t("ViewMarineUnloadingDetails_TankCode")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("BayCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="BayCode"
                  field="BayCode"
                  header={t("ViewMarineUnloadingDetails_BayCode")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("BCUCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="BCUCode"
                  field="BCUCode"
                  header={t("ViewMarineUnloadingDetails_BCUCode")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("MeterCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="MeterCode"
                  field="MeterCode"
                  header={t("ViewMarineUnloadingDetails_MeterCode")}
                  initialWidth="120px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("GrossQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="GrossQuantity"
                  field="GrossQuantity"
                  header={t("ViewMarineUnloadingDetails_GrossQuantity")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("NetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="NetQuantity"
                  field="NetQuantity"
                  header={t("ViewMarineUnloadingDetails_NetQuantity")}
                  initialWidth="120px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Density") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="Density"
                  field="Density"
                  header={t("ViewMarineUnloadingDetails_ProductDensity")}
                  initialWidth="140px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Pressure") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="Pressure"
                  field="Pressure"
                  header={t("ViewMarineUnloadingDetails_Pressure")}
                  initialWidth="100px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Temperature") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="Temperature"
                  field="Temperature"
                  header={t("ViewMarineUnloadingDetails_Temperature")}
                  initialWidth="120px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartTime") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="StartTime"
                  field="StartTime"
                  header={t("ViewMarineUnloadingDetails_StartTime")}
                  initialWidth="200px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => formatDate(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndTime") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="EndTime"
                  field="EndTime"
                  header={t("ViewMarineUnloadingDetails_EndTime")}
                  initialWidth="200px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => formatDate(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartTotalizer") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="StartTotalizer"
                  field="StartTotalizer"
                  header={t("ViewMarineUnloadingDetails_StartTotalizer")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNoSpaceNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndTotalizer") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="EndTotalizer"
                  field="EndTotalizer"
                  header={t("ViewMarineUnloadingDetails_EndTotalizer")}
                  initialWidth="120px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNoSpaceNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("NetStartTotalizer") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="NetStartTotalizer"
                  field="NetStartTotalizer"
                  header={t("ViewMarineUnloadingDetails_netstarttotalizer")}
                  initialWidth="150px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNoSpaceNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("NetEndtoTalizer") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="NetEndtoTalizer"
                  field="NetEndtoTalizer"
                  header={t("ViewMarineUnloadingDetails_netendtotalizer")}
                  initialWidth="140px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNoSpaceNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TransactionID") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="TransactionID"
                  field="TransactionID"
                  header={t("ViewMarineUnloadingDetails_TransactionNo")}
                  initialWidth="170px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNoSpaceNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Mass") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="Mass"
                  field="Mass"
                  header={t("ViewMarineUnloadingDetails_Mass")}
                  initialWidth="100px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("WeightInAir") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="WeightInAir"
                  field="WeightInAir"
                  header={t("ViewMarineUnloadingDetails_WeightInAir")}
                  initialWidth="100px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("WeightInVacuum") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="WeightInVacuum"
                  field="WeightInVacuum"
                  header={t("ViewMarineUnloadingDetails_WeightInVacuum")}
                  initialWidth="100px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankStartGrossQuantity") >
              -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="TankStartGrossQuantity"
                  field="TankStartGrossQuantity"
                  header={t(
                    "ViewMarineUnloadingDetails_TankStartGrossQuantity"
                  )}
                  initialWidth="200px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankEndGrossQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="TankEndGrossQuantity"
                  field="TankEndGrossQuantity"
                  header={t("ViewMarineUnloadingDetails_TankEndGrossQuantity")}
                  initialWidth="200px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankStartNetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="TankStartNetQuantity"
                  field="TankStartNetQuantity"
                  header={t("ViewMarineUnloadingDetails_TankStartNetQuantity")}
                  initialWidth="200px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankEndNetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="TankEndNetQuantity"
                  field="TankEndNetQuantity"
                  header={t("ViewMarineUnloadingDetails_TankEndNetQuantity")}
                  initialWidth="200px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}

              {loadingDetailsHideFields.indexOf("TankStartGrossMass") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="TankStartGrossMass"
                  field="TankStartGrossMass"
                  header={t("ViewMarineUnloadingDetails_TankStartGrossMass")}
                  initialWidth="180px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankEndGrossMass") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="TankEndGrossMass"
                  field="TankEndGrossMass"
                  header={t("ViewMarineUnloadingDetails_TankEndGrossMass")}
                  initialWidth="180px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartTemperature") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="StartTemperature"
                  field="StartTemperature"
                  header={t("ViewMarineUnloadingDetails_StartTemperature")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndTemperature") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="EndTemperature"
                  field="EndTemperature"
                  header={t("ViewMarineUnloadingDetails_EndTemperature")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartPressure") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="StartPressure"
                  field="StartPressure"
                  header={t("ViewMarineUnloadingDetails_StartPressure")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndPressure") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="EndPressure"
                  field="EndPressure"
                  header={t("ViewMarineUnloadingDetails_EndPressure")}
                  initialWidth="120px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("ReferenceDensity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="ReferenceDensity"
                  field="ReferenceDensity"
                  header={t("ViewMarineUnloadingDetails_ReferenceDensity")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartProductDensity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="StartProductDensity"
                  field="StartProductDensity"
                  header={t("ViewMarineUnloadingDetails_StartProductDensity")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndProductDensity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="EndProductDensity"
                  field="EndProductDensity"
                  header={t("ViewMarineUnloadingDetails_EndProductDensity")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartWeightInAir") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="StartWeightInAir"
                  field="StartWeightInAir"
                  header={t("ViewMarineUnloadingDetails_StartWeightInAir")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndWeightInAir") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="EndWeightInAir"
                  field="EndWeightInAir"
                  header={t("ViewMarineUnloadingDetails_EndWeightInAir")}
                  initialWidth="120px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Remarks") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="Remarks"
                  field="Remarks"
                  header={t("ViewMarineUnloadingDetails_Remarks")}
                  initialWidth="100px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}

              {loadingDetailsHideFields.indexOf("PresetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="PresetQuantity"
                  field="PresetQuantity"
                  header={t("ViewMarineUnloadingDetails_PresetQuantity")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("resetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="resetQuantity"
                  field="resetQuantity"
                  header={t("ViewMarineUnloadingDetails_resetQuantity")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                  renderer={(celldata) => changeNumber(celldata)}
                ></DataTable.Column>
              )}

              {loadingDetailsHideFields.indexOf("CalculatedGross") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="CalculatedGross"
                  field="CalculatedGross"
                  header={t("ViewMarineUnloadingDetails_CalculatedGross")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("CalculatedNet") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="CalculatedNet"
                  field="CalculatedNet"
                  header={t("ViewMarineUnloadingDetails_CalculatedNet")}
                  initialWidth="120px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("CalculatedValueUOM") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  key="CalculatedValueUOM"
                  field="CalculatedValueUOM"
                  header={t("ViewMarineUnloadingDetails_CalculatedValueUOM")}
                  initialWidth="130px"
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
            </DataTable>
          </div>
          {displayTMModalforInValidConfirm()}
        </div>
        <div className="row" style={{ paddingTop: "15px" }}>
          <div className="col col-lg-8">
            <Button
              className="backButton"
              onClick={handleBack}
              content={t("Back")}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
