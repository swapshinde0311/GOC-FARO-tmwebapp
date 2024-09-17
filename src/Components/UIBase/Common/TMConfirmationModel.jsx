import React from "react";
import {
  Modal,
  Button,
} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
TMConfirmationModel.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  isShow: PropTypes.bool.isRequired,
};
export function TMConfirmationModel({
  onConfirm,
  isShow,
  confirmText,
  cancelText,
  submitText
}) {
  function DisplayTMconfirmationModel() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={isShow} size="small">
            <Modal.Content>
              <div>
                <b>{t(confirmText)}</b>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                content={t(cancelText)}
                onClick={() =>{ 
                  onConfirm(false);
                }}
              />
              <Button
                type="primary"
                content={t(submitText)}
                onClick={() => {
                  onConfirm(true);
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  return (
    <div className="row" style={{ alignItems: "flex-start", padding: "0px" }}>
      <div
        className="col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10"
        style={{ padding: "0px" }}
      >
        <div className="row" style={{ marginTop: "10px", alignItems: "" }}>
          {DisplayTMconfirmationModel()}
        </div>
      </div>
    </div>
  );
}
