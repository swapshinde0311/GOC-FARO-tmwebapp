import React from 'react';
import PropTypes from 'prop-types';
import WijmoGrid from '../../UIBase/Common/WijmoGrid';

const WijmoGridComposite = (props) => {
    return (
        <WijmoGrid
            sourceData={props.data}
            columns={props.columns}
            exportRequired={props.exportRequired}
            exportFileName={props.exportFileName}
            columnPickerRequired={props.columnPickerRequired}
            selectionRequired={props.selectionRequired}
            columnGroupingRequired={props.columnGroupingRequired}
            conditionalRowStyleCheck={props.conditionalRowStyleCheck}
            conditionalRowStyles={props.conditionalRowStyles}
            rowsPerPage={props.rowsPerPage}
            onSelectionHandle={props.onSelectionHandle}
            onRowClick={props.onRowClick}
            parentComponent={props.parentComponent}
            terminalsToShow={props.terminalsToShow}
            singleSelection={props.singleSelection}
            selectedItems={props.selectedItems}
        />
    )
}

WijmoGridComposite.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    exportRequired: PropTypes.bool.isRequired,
    exportFileName: PropTypes.string,
    selectionRequired: PropTypes.bool,
    columnPickerRequired: PropTypes.bool,
    columnGroupingRequired: PropTypes.bool,
    conditionalRowStyleCheck: PropTypes.func,
    conditionalRowStyles: PropTypes.object,
    rowsPerPage: PropTypes.number,
    onSelectionHandle: PropTypes.func,
    parentComponent: PropTypes.string.isRequired,
    onRowClick: PropTypes.func,
    terminalsToShow: PropTypes.number,
    singleSelection: PropTypes.bool,
    selectedItems: PropTypes.array
}

export default WijmoGridComposite;