import React from 'react';
import { Icon, Modal, Button } from '@scuf/common';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../ErrorBoundary';
import { TranslationConsumer } from "@scuf/localization";
import "../../../CSS/styles.css"

const CommonConfirmModal = (props) => {
  return (
    <ErrorBoundary>
      <TranslationConsumer>
        {(t) => (
          <div id="confirmModal">
            <Modal open={props.isOpen} size="large">
              <Modal.Content>
                <div style={{ textAlign: "center", fontSize: "20px" }}>
                  <div>
                    <b>{t(props.confirmMessage)}</b>
                  </div>
                  <div style={{ marginTop: "50px" }}>
                    <Button
                      type="secondary"
                      content={t("COMMON_NO")}
                      onClick={() => props.handleNo()}
                    />
                    <Button
                      type="primary"
                      content={t("COMMON_YES")}
                      onClick={() => props.handleYes()}
                    />
                  </div>
                </div>
              </Modal.Content>
            </Modal>
          </div>
        )}
      </TranslationConsumer>
    </ErrorBoundary >
  )
}

CommonConfirmModal.propTypes = {
  confirmMessage: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleYes: PropTypes.func,
  handleNo: PropTypes.func
}

CommonConfirmModal.defaultProps = {
  isOpen: false
}

export default CommonConfirmModal;