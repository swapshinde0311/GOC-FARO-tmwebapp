import React from "react";
import { Input, Select, Icon } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";

import { TimePickerMod as TimePicker } from "../Common/TimePicker";
import moment from "moment-timezone";
import * as Utilities from "../../../JS/Utilities";

RailRouteDetails.propTypes = {
  railRoute: PropTypes.object.isRequired,
  modRailRoute: PropTypes.object.isRequired,
  modAssociations: PropTypes.array.isRequired,
  validationErrors: PropTypes.object.isRequired,
  listOptions: PropTypes.shape({
    shareholders: PropTypes.array,
    terminalCodes: PropTypes.array,
    customerDestinationOptions: PropTypes.object,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAllTerminalsChange: PropTypes.func.isRequired,
  selectedRow: PropTypes.array.isRequired,
  handleAssociationSelectionChange: PropTypes.func.isRequired,
  handleCellDataEdit: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  handleDeleteAssociation: PropTypes.func.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
};

RailRouteDetails.defaultProps = {
  isEnterpriseNode: false,
};

export function RailRouteDetails({
  railRoute,
  modRailRoute,
  modAssociations,
  validationErrors,
  listOptions,
  onFieldChange,
  onAllTerminalsChange,
  selectedRow,
  handleAssociationSelectionChange,
  handleCellDataEdit,
  handleAddAssociation,
  handleDeleteAssociation,
  isEnterpriseNode,
}) {
  const [t] = useTranslation();

  const handleCustomEditDropDown = (cellData, dropDownoptions) => {
    return (
      <Select
        className="selectDropwdown"
        value={modAssociations[cellData.rowIndex][cellData.field]}
        fluid
        options={dropDownoptions}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        indicator="required"
        reserveSpace={false}
        search={true}
        noResultsMessage={t("noResultsMessage")}
      />
    );
  };

  const handleCustomEditTextBox = (cellData) => {
    return (
      <Input
        fluid
        value={modAssociations[cellData.rowIndex][cellData.field]}
        onChange={(value) => handleCellDataEdit(value, cellData)}
        reserveSpace={false}
      />
    );
  };

  const handleDestinationEditDropDown = (cellData) => {
    let destinationList = [];
    if (
      listOptions.customerDestinationOptions[
        cellData.rowData["ShareholderCode"]
      ] !== undefined &&
      listOptions.customerDestinationOptions[
        cellData.rowData["ShareholderCode"]
      ] !== null
    ) {
      for (let customerCode in listOptions.customerDestinationOptions[
        cellData.rowData["ShareholderCode"]
      ]) {
        listOptions.customerDestinationOptions[
          cellData.rowData["ShareholderCode"]
        ][customerCode].forEach((destination) => {
          if (destinationList.indexOf(destination) === -1) {
            destinationList.push(destination);
          }
        });
      }
      destinationList.sort((a, b) => {
        if (a > b) {
          return 1;
        } else if (a < b) {
          return -1;
        } else {
          return 0;
        }
      });
    }
    return handleCustomEditDropDown(
      cellData,
      Utilities.transferListtoOptions(destinationList)
    );
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailRoute.RouteCode}
                label={t("RailRouteConfigurationDetails_RailRouteCode")}
                indicator="required"
                disabled={railRoute.RouteCode !== ""}
                onChange={(data) => onFieldChange("RouteCode", data)}
                error={t(validationErrors.RouteCode)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailRoute.DestinationCode}
                label={t("RailRouteConfigurationDetails_FinalDestinationCode")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              {/*<DatePicker
                                fluid
                                value={modRailRoute.DepartureTime === null ?
                                    "" : new Date(modRailRoute.DepartureTime)}
                                label={t("RailRouteConfigurationList_DepartureTime")}
                                type="datetime"
                                displayFormat={getCurrentDateFormat()}
                                onChange={(data) => onFieldChange("DepartureTime", data)}
                                error={t(validationErrors.DepartureTime)}
                                reserveSpace={false}
                                />*/}
              <TimePicker
                value={moment(
                  modRailRoute.DepartureTime === null
                    ? new Date().setSeconds(0)
                    : new Date(modRailRoute.DepartureTime).setSeconds(0)
                )}
                label={t("RailRouteConfigurationList_DepartureTime")}
                displayFormat={"hh:mm A"}
                onChange={(data) =>
                  onFieldChange("DepartureTime", moment(data).format())
                }
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailRoute.Description}
                label={t("RailRouteConfigurationDetails_Description")}
                onChange={(data) => onFieldChange("Description", data)}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder={t("Common_Select")}
                label={t("Cust_Status")}
                value={modRailRoute.Active}
                options={[
                  {
                    text: t("RailRouteConfigurationDetails_Active"),
                    value: true,
                  },
                  {
                    text: t("RailRouteConfigurationDetails_Inactive"),
                    value: false,
                  },
                ]}
                onChange={(data) => onFieldChange("Active", data)}
                noResultsMessage={t("noResultsMessage")}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRailRoute.Remarks}
                label={t("Cust_Remarks")}
                onChange={(data) => onFieldChange("Remarks", data)}
                indicator={
                  modRailRoute.Active !== railRoute.Active ? "required" : ""
                }
                error={t(validationErrors.Remarks)}
                reserveSpace={false}
              />
            </div>
            {isEnterpriseNode ? (
              <div className="col-12 col-md-6 col-lg-4">
                <AssociatedTerminals
                  terminalList={listOptions.terminalCodes}
                  selectedTerminal={modRailRoute.TerminalCodes}
                  error={t(validationErrors.TerminalCodes)}
                  onFieldChange={onFieldChange}
                  onCheckChange={onAllTerminalsChange}
                ></AssociatedTerminals>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="row compartmentRow">
            <div className="col col-md-8 col-lg-9 col col-xl-9"></div>
            <div className="col col-md-4 col-lg-3 col-xl-3">
              <div className="compartmentIconContainer">
                <div onClick={handleAddAssociation} className="compartmentIcon">
                  <div>
                    <Icon root="common" name="badge-plus" size="medium" />
                  </div>
                  <div className="margin_l10">
                    <h5 className="font14">{t("FinishedProductInfo_Add")}</h5>
                  </div>
                </div>

                <div
                  onClick={handleDeleteAssociation}
                  className="compartmentIcon margin_l30"
                >
                  <div>
                    <Icon root="common" name="delete" size="medium" />
                  </div>
                  <div className="margin_l10">
                    <h5 className="font14">{t("DestAdd_Delete")}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row marginRightZero tableScroll">
            <div className="col-12 detailsTable">
              <DataTable
                data={modAssociations}
                selectionMode="multiple"
                selection={selectedRow}
                onSelectionChange={handleAssociationSelectionChange}
              >
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="SequenceNo"
                  field="SequenceNo"
                  header={t("RailRouteConfigurationDetails_Sequence")}
                  editable={false}
                  editFieldType="text"
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="ShareholderCode"
                  field="ShareholderCode"
                  header={t("RailRouteConfigurationList_Shareholder")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(celldata) =>
                    handleCustomEditDropDown(celldata, listOptions.shareholders)
                  }
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="DestinationCode"
                  field="DestinationCode"
                  header={t("RailRouteConfigurationDetails_DestinationCode")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={(celldata) =>
                    handleDestinationEditDropDown(celldata)
                  }
                ></DataTable.Column>
                <DataTable.Column
                  className="compColHeight colminWidth"
                  key="Remarks"
                  field="Remarks"
                  header={t("RailRouteConfigurationDetails_Remarks")}
                  editable={true}
                  editFieldType="text"
                  customEditRenderer={handleCustomEditTextBox}
                ></DataTable.Column>
              </DataTable>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
