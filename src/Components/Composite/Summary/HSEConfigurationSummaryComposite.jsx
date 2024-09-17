import React from "react";
import WijmoGridComposite from "../Common/WijmoGridComposite";
import PropTypes from "prop-types";

HSEConfigurationSummaryPageComposite.propTypes = {
  tableData: PropTypes.array.isRequired,
  columnDetails: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  exportRequired:PropTypes.bool,
  exportFileName:PropTypes.string,
  columnPickerRequired:PropTypes.bool,
  columnGroupingRequired:PropTypes.bool,
  selectionRequired:PropTypes.bool,
  terminalsToShow: PropTypes.number,
  selectedItems: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  parentComponent:PropTypes.string,
};

HSEConfigurationSummaryPageComposite.defaultProps = {
  pageSize: 10,
  terminalsToShow: 2,
  tableData: [],
  columnDetails: [],
  //selectedItems: [],
};

export function HSEConfigurationSummaryPageComposite({
  tableData,
  columnDetails,
  pageSize,
  exportRequired,
  exportFileName,
  columnPickerRequired,
  columnGroupingRequired,
  selectionRequired,
  terminalsToShow,
  onSelectionChange,
  onRowClick,
  parentComponent
}) {
  return (
    <WijmoGridComposite
    data={tableData}
    columns={columnDetails}
    rowsPerPage={pageSize}
    exportRequired={exportRequired}
    exportFileName={exportFileName}
    columnPickerRequired={columnPickerRequired}
    columnGroupingRequired={columnGroupingRequired}
    selectionRequired={selectionRequired}
    onSelectionHandle={onSelectionChange}
    onRowClick={onRowClick}
    parentComponent={parentComponent}
    terminalsToShow={terminalsToShow}
  ></WijmoGridComposite>
  );
}
