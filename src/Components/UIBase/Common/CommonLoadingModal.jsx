import React from 'react';
import { Loader, Modal, Button } from '@scuf/common';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../ErrorBoundary';
import { TranslationConsumer } from "@scuf/localization";
import "../../../CSS/styles.css"

const CommonLoadingModal = (props) => {
  return (
    <ErrorBoundary>
      <TranslationConsumer>
        {(t) => (
          <div id="confirmModal">
            <Modal className="common-loading-modal" open={props.isOpen} size="large">
              <Modal.Content>
                <div style={{ textAlign: "center", fontSize: "20px", minHeight:"100px" }}>
                  <Loader text={props.loadingMessage}></Loader>
                </div>
              </Modal.Content>
            </Modal>
          </div>
        )}
      </TranslationConsumer>
    </ErrorBoundary >
  )
}

CommonLoadingModal.propTypes = {
  loadingMessage: PropTypes.string,
  isOpen: PropTypes.bool.isRequired
}

CommonLoadingModal.defaultProps = {
  isOpen: false
}

export default CommonLoadingModal;