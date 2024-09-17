import React from 'react';
import { Icon, Modal, Button } from '@scuf/common';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../ErrorBoundary';
import { TranslationConsumer } from "@scuf/localization";
import "../../../CSS/styles.css"

const CommonMessageModal = (props) => {
  return (
    <ErrorBoundary>
      <TranslationConsumer>
        {(t) => (
          <div>
            {props.isSuccess ? (
              <div id="successModal">
                <Modal open={props.isOpen} size="large">
                  <Modal.Content>
                    <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <Icon className="font-color-success" root="common" name="badge-check" size="medium" />
                      </div>
                      <div>
                        {t(props.message)}
                      </div>
                      <div style={{ marginTop: "50px" }}>
                        <Button
                          type="primary"
                          content={t("COMMON_CLOSE")}
                          onClick={() => props.handleClose()}
                        />
                      </div>
                    </div>
                  </Modal.Content>
                </Modal>
              </div>
            ) : ""}

            {props.isSuccess ? "" : (
              <div id="failedModal">
                <Modal open={props.isOpen} size="large">
                  <Modal.Content>
                    <div style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <Icon className="font-color-failed" root="common" name="badge-warning" size="medium" />
                      </div>
                      <div>
                        {t(props.message)}
                      </div>
                      <div style={{ marginTop: "50px" }}>
                        <Button
                          type="primary"
                          content={t("COMMON_CLOSE")}
                          onClick={() => props.handleClose()}
                        />
                      </div>
                    </div>
                  </Modal.Content>
                </Modal>
              </div>
            )}
          </div>
        )}
      </TranslationConsumer>
    </ErrorBoundary >
  )
}

CommonMessageModal.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  message: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func
}

CommonMessageModal.defaultProps = {
  isOpen: false,
  isSuccess: true
}

export default CommonMessageModal;