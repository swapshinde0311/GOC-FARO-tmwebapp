import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";

OperatorDashboardSummaryComposite.propTypes = {
  statesCount: PropTypes.object.isRequired,
};

OperatorDashboardSummaryComposite.defaultProps = {};

export function OperatorDashboardSummaryComposite({ statesCount }) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div>
          <div className="row">
            <div className="col-12 col-md-6 col-xl-2">
              <div className="background">
                <div className="tile" style={{ borderLeftColor: "green" }}>
                  <div className="tileValue">
                    <span style={{ color: "green" }}>{statesCount["AS"]}</span>
                  </div>
                  <div className="tileName">
                    {t("Active") + "   " + t("Shipment")}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-2">
              <div className="background">
                <div className="tile" style={{ borderLeftColor: "green" }}>
                  <div className="tileValue">
                    <span style={{ color: "green" }}>{statesCount["PS"]}</span>
                  </div>
                  <div className="tileName">
                    {t("Pending") + "   " + t("Shipment")}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-2">
              <div className="background">
                <div className="tile" style={{ borderLeftColor: "green" }}>
                  <div className="tileValue">
                    <span style={{ color: "green" }}>{statesCount["IS"]}</span>
                  </div>
                  <div className="tileName">
                    {t("Interrupted") + "   " + t("Shipment")}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-2">
              <div className="background">
                <div className="tile" style={{ borderLeftColor: "green" }}>
                  <div className="tileValue">
                    <span style={{ color: "green" }}>{statesCount["AR"]}</span>
                  </div>
                  <div className="tileName">
                    {t("Active") + "   " + t("Receipt")}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-2">
              <div className="background">
                <div className="tile" style={{ borderLeftColor: "green" }}>
                  <div className="tileValue">
                    <span style={{ color: "green" }}>{statesCount["PR"]}</span>
                  </div>
                  <div className="tileName">
                    {t("Pending") + "   " + t("Receipt")}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-2">
              <div className="background">
                <div className="tile" style={{ borderLeftColor: "green" }}>
                  <div className="tileValue">
                    <span style={{ color: "green" }}>{statesCount["IR"]}</span>
                  </div>
                  <div className="tileName">
                    {t("Interrupted") + "   " + t("Receipt")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
