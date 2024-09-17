import React, { useState } from "react";
import { Button, Modal } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";

SiteDetailsUserActions.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  saveEnabled: PropTypes.bool,
  isDeleteEnabled: PropTypes.bool
};

SiteDetailsUserActions.defaultProps = { saveEnabled: true, isDeleteEnabled: false };
export function SiteDetailsUserActions({
  handleDelete,
  handleSave,
  isDeleteEnabled,
  saveEnabled,
  isEnterpriseNode,
  isBCU,
  handleSkipLocalLoadFetch
}) {
  const [modelOpen, setModelOpen] = useState(false);
  function displayTMModalforDelete() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={modelOpen} size="small">
            <Modal.Content>
              <div>
                <b>{t("Confirm_Delete")}</b>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                content={t("Cancel")}
                onClick={() => setModelOpen(false)}
              />
              <Button
                type="primary"
                content={t("PipelineDispatch_BtnSubmit")}
                onClick={() => {
                  setModelOpen(false);
                  handleDelete();
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }
  return (
    <div>
      <TranslationConsumer>
        {(t) => (
          <div className="row">
            <div className="col-lg-12 pr-4 mt-2" style={{ textAlign: "right" }}>
              <Button
                content={t("Loadingarm_Delete")}
                className={isEnterpriseNode === true || isDeleteEnabled !== true ? "cancelENButton" : "cancelButton"}
                disabled={!isDeleteEnabled || (isEnterpriseNode === true ? true : false)}
                onClick={() => {
                  setModelOpen(true);
                }}
              ></Button>
              <Button
                content={t("Save")}
                disabled={!saveEnabled || (isEnterpriseNode === true ? true : false)}
                onClick={handleSave}
              ></Button>
              {/* {
                isBCU ? <Button
                  content={t("DeviceInfo_SkipLocalLoadFetch")}
                  disabled={!saveEnabled || (isEnterpriseNode === true ? true : false)}
                  onClick={handleSkipLocalLoadFetch}
                ></Button> : null
              } */}
            </div>
          </div>
        )}
      </TranslationConsumer>
      {displayTMModalforDelete()}
    </div>
  );
}

