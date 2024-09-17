import React from "react";
import { Input } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { Button } from "@scuf/common";

AutoACLocationDetails.propTypes = {
  handleSetLocation: PropTypes.func.isRequired,
  location: PropTypes.array.isRequired,
};

AutoACLocationDetails.defaultProps = {};

export function AutoACLocationDetails({ handleSetLocation, location }) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="autoDetailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={location === undefined ? "" : location[1]}
                label={t("Location_Code")}
                disabled="true"
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={location === undefined ? "" : location[2]}
                label={t("LocationInfo_LocationType")}
                disabled="true"
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={location === undefined ? "" : location[0]}
                label={t("CardReader_Title")}
                disabled="true"
                reserveSpace={false}
              />
            </div>
          </div>
          <div className="detailsButton">
            <Button
              content={t("TemporaryCard_SetLocation")}
              onClick={handleSetLocation}
            ></Button>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
