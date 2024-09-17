import React from "react";
import PropTypes from "prop-types";
import { Input, Button, Accordion, Checkbox } from "@scuf/common";
import { AttributeDetails } from "../Details/AttributeDetails";
import { useTranslation } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";
import ErrorBoundary from "../../ErrorBoundary";
import * as Constants from "../../../JS/Constants";

TruckShipmentTrailerDetails.propTypes = {
  trailerDetails: PropTypes.array.isRequired,
  selectedAttributeList: PropTypes.array.isRequired,
  handleBack: PropTypes.func.isRequired,
  ShipmentCode: PropTypes.string,
  compAttributes: PropTypes.array.isRequired,
};

export default function TruckShipmentTrailerDetails({
  trailerDetails,
  selectedAttributeList,
  handleBack,
  ShipmentCode,
  compAttributes,
}) {
  const [t] = useTranslation();

  const handleclick = () => {};

  const handleAttributeType = (data) => {
    const attribute = data.rowData.AttributesforUI.filter(
      (att) => att.AttributeName === data.name
    )[0];

    return attribute.DataType.toLowerCase() ===
      Constants.DataType.STRING.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
        Constants.DataType.INT.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
        Constants.DataType.LONG.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
        Constants.DataType.FLOAT.toLowerCase() ? (
      <label>{attribute.AttributeValue}</label>
    ) : attribute.DataType.toLowerCase() ===
      Constants.DataType.BOOL.toLowerCase() ? (
      <Checkbox
        checked={
          attribute.AttributeValue.toString().toLowerCase() === "true"
            ? true
            : false
        }
        disabled={true}
      ></Checkbox>
    ) : (
      <label>{new Date(attribute.AttributeValue).toLocaleDateString()}</label>
    );
  };


  return (
    <div className="detailsContainer">
      <div className="row">
        <div className="col col-md-8 col-lg-9 col col-xl-9">
          <h3>{t("Vehicle_TRDetails") + " : " + ShipmentCode}</h3>
        </div>
      </div>
      {trailerDetails && trailerDetails.length > 0
        ? trailerDetails.map((item) => (
            <ErrorBoundary>
              <Accordion className="shipmentTrailerAccordion">
                <Accordion.Content
                  className="attributeAccordian"
                  title={item.shipmentTrailerInfo.TrailerName}
                >
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-4">
                      <Input
                        fluid
                        value={item.shipmentTrailerInfo.TrailerCode}
                        label={t("ShipmentCompDetail_wcTrailerCode")}
                        disabled={true}
                        reserveSpace={false}
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <Input
                        fluid
                        value={item.shipmentTrailerInfo.TrailerName}
                        label={t("ShipmentCompDetail_wcTrailerName")}
                        disabled={true}
                        reserveSpace={false}
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <Input
                        fluid
                        value={item.shipmentTrailerInfo.TareWeight}
                        label={t("ViewShipmentTrailer_RegisteredTAREWt")}
                        disabled={true}
                        reserveSpace={false}
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <Input
                        fluid
                        value={item.shipmentTrailerInfo.MaxLoadableWeight}
                        label={t("PrimeMover_MaxLoadWeight")}
                        disabled={true}
                        reserveSpace={false}
                      />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <Input
                        fluid
                        value={item.shipmentTrailerInfo.MaxLoadableVolume}
                        label={t("ViewShipmentTrailer_MaxLoadableVolume")}
                        disabled={true}
                        reserveSpace={false}
                      />
                    </div>
                  </div>
                  {selectedAttributeList.length > 0
                    ? selectedAttributeList.map((attire) => (
                        <ErrorBoundary>
                          <Accordion className="shipmentTrailerAttributeAccordion">
                            <Accordion.Content
                              className="attributeAccordian"
                              title={t("SHIPMENTTRAILER_Attributes")} //{isEnterpriseNode ? (attire.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                            >
                              <AttributeDetails
                                selectedAttributeList={
                                  attire.attributeMetaDataList
                                }
                                handleCellDataEdit={handleclick}
                                attributeValidationErrors={handleclick}
                              ></AttributeDetails>
                            </Accordion.Content>
                          </Accordion>
                        </ErrorBoundary>
                      ))
                    : null}
                  <div className="row">
                    <div className="col-12 detailsTable">
                      <DataTable
                        className="shipmentTrailerTareWeightTable"
                        data={item.shipmentTrailerTWInfoList}
                        scrollable={true}
                        scrollHeight="320px"
                      >
                        <DataTable.Column
                          className="compColHeight"
                          key="TareWeightTime"
                          field="TareWeightTime"
                          header={t("ViewShipmentTrailerStatus_Time")}
                          editable={false}
                        ></DataTable.Column>
                        <DataTable.Column
                          className="compColHeight"
                          key="WeighBridgeCode"
                          field="WeighBridgeCode"
                          header={t("ViewShipmentTrailerStatus_Weighbridge")}
                          editable={false}
                        ></DataTable.Column>
                        <DataTable.Column
                          className="compColHeight"
                          key="TareWeight"
                          field="TareWeight"
                          header={t("ViewShipmentTrailerStatus_TareWeight")}
                          editable={false}
                        ></DataTable.Column>
                        {compAttributes
                          ? compAttributes.map((att) => {
                              return (
                                <DataTable.Column
                                  className="compColHeight"
                                  header={t(att.AttributeName)}
                                  editable={false}
                                  renderer={handleAttributeType}
                                ></DataTable.Column>
                              );
                            })
                          : null}
                      </DataTable>
                    </div>
                    <div className="col-12 detailsTable">
                      <DataTable
                        className="shipmentTrailerTareWeightTable"
                        data={item.shipmentTrailerWBInfoList}
                        scrollable={true}
                        scrollHeight="320px"
                      >
                        <DataTable.Column
                          className="compColHeight"
                          key="EndTime"
                          field="EndTime"
                          header={t("ViewShipmentTrailerStatus_Time")}
                          editable={false}
                        ></DataTable.Column>
                        <DataTable.Column
                          className="compColHeight"
                          key="WeighBridgeCode"
                          field="WeighBridgeCode"
                          header={t("ViewShipmentTrailerStatus_Weighbridge")}
                          editable={false}
                        ></DataTable.Column>
                        <DataTable.Column
                          className="compColHeight"
                          key="MeasuredWeight"
                          field="MeasuredWeight"
                          header={t("ViewShipmentTrailerStatus_MeasuredWeight")}
                          editable={false}
                        ></DataTable.Column>
                        <DataTable.Column
                          className="compColHeight"
                          key="MaxLoadVol"
                          field="MaxLoadVol"
                          header={t(
                            "ViewShipmentTrailerStatus_ActualLoadedVol"
                          )}
                          editable={false}
                        ></DataTable.Column>
                        {compAttributes
                          ? compAttributes.map((att) => {
                              return (
                                <DataTable.Column
                                  className="compColHeight"
                                  header={t(att.AttributeName)}
                                  editable={false}
                                  renderer={handleAttributeType}
                                ></DataTable.Column>
                              );
                            })
                          : null}
                      </DataTable>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion>
            </ErrorBoundary>
          ))
        : null}
      <div className="row">
        <div className="col col-lg-8">
          <Button
            className="backButton"
            onClick={handleBack}
            content={t("Back")}
          ></Button>
        </div>
      </div>
    </div>
  );
}
