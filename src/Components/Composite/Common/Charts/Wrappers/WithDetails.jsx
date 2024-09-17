import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../ErrorBoundary';
import DashboardCard from '../WidgetOutlines/DashboardCard';
import CustomModal from '../WidgetOutlines/CustomModal';

WithDetails.propTypes = {
    cardHeader: PropTypes.string.isRequired,
    clickHandler: PropTypes.func,
    childCount: PropTypes.number.isRequired,
    exportHandler: PropTypes.func,
    exportName: PropTypes.string,
    modalOpen: PropTypes.bool,
    closeHandler: PropTypes.func,
    modalContent: PropTypes.object,
    fullScreenHandler: PropTypes.func
}

export default function WithDetails(props) {
    return (
        <ErrorBoundary>
            <DashboardCard
                header={props.cardHeader}
                clickHandler={props.handleClick}
                childCount={props.childCount}
                exportHandler={props.exportHandler}
                fullScreenHandler={props.fullScreenHandler}
                isExportRequired={props.isExportRequired}
                isFullScreenRequired={props.isFullScreenRequired}
                exportName={props.cardHeader}>
                {props.children}
            </DashboardCard>
            {
                props.modalOpen ? (
                    <CustomModal
                        header={props.cardHeader}
                        openModal={props.modalOpen}
                        closeHandler={props.handleModalClose}
                    >
                        {props.modalContent}
                    </CustomModal>
                ) : null
            }
        </ErrorBoundary>
    );
}