import React from "react";
import { Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
TMDetailsCompartment.propTypes = {
  handleBack: PropTypes.func.isRequired,
  handManualEntry: PropTypes.func.isRequired,
  ManualEntry: PropTypes.bool.isRequired,
};
export function TMDetailsCompartment({
  handleBack,
  handManualEntry,
  ManualEntry,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="row">
          <div className="col col-lg-8">
            <Button
              className="backButton"
              onClick={handleBack}
              content={t("Back")}
            ></Button>
          </div>
          <div className="col col-lg-4" style={{ textAlign: "right" }}>
            <Button
              content={t("ReceiptByCompartmentList_ManualEntry")}
              onClick={handManualEntry}
              content={t("ViewRailDispatchList_ManualEntry")}
              disabled={!ManualEntry}
            ></Button>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
