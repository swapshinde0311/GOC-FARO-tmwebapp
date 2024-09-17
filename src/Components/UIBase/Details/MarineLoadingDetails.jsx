import React, { useState } from "react";
import { DataTable } from "@scuf/datatable";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import { Button, Modal } from "@scuf/common";
import PropTypes from "prop-types";
import TMDetailsHeader from "../Common/TMDetailsHeader";
import * as Utilities from "../../../JS/Utilities";
import {
  fnViewMarineLoadingDetails,
  functionGroups,
} from "../../../JS/FunctionGroups";

MarineLoadingDetails.propTypes = {
  setValid: PropTypes.func.isRequired,
  tableData: PropTypes.array,
  onSaved: PropTypes.func.isRequired,
  userDetails: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
  isWebPortalUser: PropTypes.bool.isRequired,
};

MarineLoadingDetails.defaultProps = {};

export default function MarineLoadingDetails({
  tableData,
  loadingDetailsHideFields,
  setValid,
  onSaved,
  userDetails,
  handleBack,
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

  const disPlayValue = (cellData) => {
    try {
      const field = cellData.rowData[cellData.field];
      if (field === undefined || field === null || field === "") {
        return "";
      }
      return (
        new Date(field).toLocaleDateString() +
        " " +
        new Date(field).toLocaleTimeString()
      );
    } catch (error) {
      return "";
    }
  };

  const displayNum = (cellData) => {
    try {
      const field = cellData.rowData[cellData.field];
      if (field === undefined || field === null || field === "") {
        return "";
      }
      return field.toLocaleString();
    } catch (error) {
      return "";
    }
  };

  const handleCustom = (e) => {
    if (
      e.rowData.BaseProductCode == null ||
      e.rowData.BaseProductCode.toString().length === 0
    ) {
      return e.rowData.IsInvalid ? (
        <span>{t("ViewMarineLoadingDetails_Invalid")}</span>
      ) : status !== "CLOSED" ? (
        <button className="ValidBtn" onClick={() => changeValid(e)}>
          {t("ViewMarineLoadingDetails_Valid")}
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
        fnViewMarineLoadingDetails
      )
    ) {
      setModelOpen(true);
      setLoadingDetail(e);
    } else {
      var notification = {
        messageType: "critical",
        message: "ShipmentCompDetail_Permission",
        messageResultDetails: [
          {
            keyFields: "",
            keyValues: "",
            isSuccess: false,
            errorMessage: "ShipmentCompDetail_LoadingDetailsPermission",
          },
        ],
      };
      onSaved([], "Permission", notification);
    }
  };

  const changeNumber = (e) => {
    let { value } = e;
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

  return (
    <div>
      <TMDetailsHeader
        entityCode={t("ViewMarineLoadingDetails_Title")}
      ></TMDetailsHeader>
      <div className="detailsContainer">
        <div className="row">
          <div className="col col-md-8 col-lg-9 col col-xl-9">
            <h4>{t("ViewShipment_LoadingDetails")}</h4>
          </div>
        </div>
        <div className="row">
          <div className="detailsTable loadingTable">
            <DataTable
              data={tableData}
              scrollable={true}
              resizableColumns={true}
            >
              {loadingDetailsHideFields.indexOf("IsInvalid") > -1 ||
              isWebPortalUser ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="90px"
                  key="IsInvalid"
                  field="IsInvalid"
                  header={t("ViewMarineLoadingDetails_Valid")}
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
                  initialWidth="130px"
                  key="CompartmentSeqNoInVehicle"
                  field="CompartmentSeqNoInVehicle"
                  header={t("ViewMarineLoadingDetails_CompartmentSeqNo")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("productcode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="productcode"
                  field="productcode"
                  header={t("ViewMarineLoadingDetails_ProductCode")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => {
                    return cellData.rowData.productcode.replace(/&nbsp;/g, " ");
                  }}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("BaseProductCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="170px"
                  key="BaseProductCode"
                  field="BaseProductCode"
                  header={t("ViewMarineLoadingDetails_BaseProductCode")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="TankCode"
                  field="TankCode"
                  header={t("ViewMarineLoadingDetails_TankCode")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("BayCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="BayCode"
                  field="BayCode"
                  header={t("ViewMarineLoadingDetails_BayCode")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("BCUCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="BCUCode"
                  field="BCUCode"
                  header={t("ViewMarineLoadingDetails_BCUCode")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("MeterCode") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="120px"
                  key="MeterCode"
                  field="MeterCode"
                  header={t("ViewMarineLoadingDetails_MeterCode")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("GrossQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="GrossQuantity"
                  field="GrossQuantity"
                  header={t("ViewMarineLoadingDetails_GrossQuantity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("NetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="120px"
                  key="NetQuantity"
                  field="NetQuantity"
                  header={t("ViewMarineLoadingDetails_NetQuantity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Density") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="140px"
                  key="Density"
                  field="Density"
                  header={t("ViewMarineLoadingDetails_ProductDensity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Pressure") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="100px"
                  key="Pressure"
                  field="Pressure"
                  header={t("ViewMarineLoadingDetails_Pressure")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Temperature") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="120px"
                  key="Temperature"
                  field="Temperature"
                  header={t("ViewMarineLoadingDetails_Temperature")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartTime") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="200px"
                  key="StartTime"
                  field="StartTime"
                  header={t("ViewMarineLoadingDetails_StartTime")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => disPlayValue(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndTime") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="200px"
                  key="EndTime"
                  field="EndTime"
                  header={t("ViewMarineLoadingDetails_EndTime")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => disPlayValue(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartTotalizer") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="StartTotalizer"
                  field="StartTotalizer"
                  header={t("ViewMarineLoadingDetails_StartTotalizer")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => displayNum(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndTotalizer") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="120px"
                  key="EndTotalizer"
                  field="EndTotalizer"
                  header={t("ViewMarineLoadingDetails_EndTotalizer")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => displayNum(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("NetStartTotalizer") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="150px"
                  key="NetStartTotalizer"
                  field="NetStartTotalizer"
                  header={t("ViewMarineLoadingDetails_netstarttotalizer")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => displayNum(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("NetEndtoTalizer") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="140px"
                  key="NetEndtoTalizer"
                  field="NetEndtoTalizer"
                  header={t("ViewMarineLoadingDetails_netendtotalizer")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => displayNum(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TransactionID") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="170px"
                  key="TransactionID"
                  field="TransactionID"
                  header={t("ViewMarineLoadingDetails_TransactionNo")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Mass") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="100px"
                  key="Mass"
                  field="Mass"
                  header={t("ViewMarineLoadingDetails_Mass")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("WeightInAir") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="100px"
                  key="WeightInAir"
                  field="WeightInAir"
                  header={t("ViewMarineLoadingDetails_WeightInAir")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("WeightInVacuum") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="100px"
                  key="WeightInVacuum"
                  field="WeightInVacuum"
                  header={t("ViewMarineLoadingDetails_WeightInVacuum")}
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
                  initialWidth="200px"
                  key="TankStartGrossQuantity"
                  field="TankStartGrossQuantity"
                  header={t("ViewMarineLoadingDetails_TankStartGrossQuantity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankEndGrossQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="200px"
                  key="TankEndGrossQuantity"
                  field="TankEndGrossQuantity"
                  header={t("ViewMarineLoadingDetails_TankEndGrossQuantity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankStartNetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="200px"
                  key="TankStartNetQuantity"
                  field="TankStartNetQuantity"
                  header={t("ViewMarineLoadingDetails_TankStartNetQuantity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => displayNum(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankEndNetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="200px"
                  key="TankEndNetQuantity"
                  field="TankEndNetQuantity"
                  header={t("ViewMarineLoadingDetails_TankEndNetQuantity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => displayNum(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankStartGrossMass") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="180px"
                  key="TankStartGrossMass"
                  field="TankStartGrossMass"
                  header={t("ViewMarineLoadingDetails_TankStartGrossMass")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("TankEndGrossMass") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="180px"
                  key="TankEndGrossMass"
                  field="TankEndGrossMass"
                  header={t("ViewMarineLoadingDetails_TankEndGrossMass")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndTemperature") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="EndTemperature"
                  field="EndTemperature"
                  header={t("ViewMarineLoadingDetails_EndTemperature")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartPressure") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="StartPressure"
                  field="StartPressure"
                  header={t("ViewMarineLoadingDetails_StartPressure")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndPressure") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="120px"
                  key="EndPressure"
                  field="EndPressure"
                  header={t("ViewMarineLoadingDetails_EndPressure")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("ReferenceDensity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="ReferenceDensity"
                  field="ReferenceDensity"
                  header={t("ViewMarineLoadingDetails_ReferenceDensity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartProductDensity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="StartProductDensity"
                  field="StartProductDensity"
                  header={t("ViewMarineLoadingDetails_StartProductDensity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndProductDensity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="EndProductDensity"
                  field="EndProductDensity"
                  header={t("ViewMarineLoadingDetails_EndProductDensity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("StartWeightInAir") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="StartWeightInAir"
                  field="StartWeightInAir"
                  header={t("ViewMarineLoadingDetails_StartWeightInAir")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("EndWeightInAir") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="120px"
                  key="EndWeightInAir"
                  field="EndWeightInAir"
                  header={t("ViewMarineLoadingDetails_EndWeightInAir")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("Remarks") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="100px"
                  key="Remarks"
                  field="Remarks"
                  header={t("ViewMarineLoadingDetails_Remarks")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("PresetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="PresetQuantity"
                  field="PresetQuantity"
                  header={t("ViewMarineLoadingDetails_PresetQuantity")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("resetQuantity") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="resetQuantity"
                  field="resetQuantity"
                  header={t("ViewMarineLoadingDetails_resetQuantity")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("CalculatedGross") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="CalculatedGross"
                  field="CalculatedGross"
                  header={t("ViewMarineLoadingDetails_CalculatedGross")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("CalculatedNet") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="120px"
                  key="CalculatedNet"
                  field="CalculatedNet"
                  header={t("ViewMarineLoadingDetails_CalculatedNet")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
                ></DataTable.Column>
              )}
              {loadingDetailsHideFields.indexOf("CalculatedValueUOM") > -1 ? (
                ""
              ) : (
                <DataTable.Column
                  className="compColHeight"
                  initialWidth="130px"
                  key="CalculatedValueUOM"
                  field="CalculatedValueUOM"
                  header={t("ViewMarineLoadingDetails_CalculatedValueUOM")}
                  editable={false}
                  editFieldType="text"
                  renderer={(cellData) => changeNumber(cellData)}
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
