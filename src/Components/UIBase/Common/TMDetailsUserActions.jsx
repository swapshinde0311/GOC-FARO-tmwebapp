import React from "react";
import { Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
TMDetailsUserActions.propTypes = {
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  saveEnabled: PropTypes.bool,
};
TMDetailsUserActions.defaultProps = { saveEnabled: false };
export function TMDetailsUserActions({
  handleBack,
  handleSave,
  handleReset,
  saveEnabled,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="row userActionPosition">
          <div className="col-12 col-md-3 col-lg-4">
            <Button
              className="backButton"
              onClick={handleBack}
              content={t("Back")}
            ></Button>
          </div>
          <div className="col-12 col-md-9 col-lg-8">
            <div style={{ float: "right" }}>
              <Button
                content={t("LookUpData_btnReset")}
                className="cancelButton"
                onClick={handleReset}
              ></Button>
              <Button
                content={t("Save")}
                disabled={!saveEnabled}
                onClick={handleSave}
              ></Button>
            </div>
          </div>
          {/* <div className="col col-lg-2">
    
  </div> */}
        </div>
      )}
    </TranslationConsumer>
  );
}
