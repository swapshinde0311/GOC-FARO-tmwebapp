import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import { Select, Checkbox } from "@scuf/common";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
AssociatedTerminals.propTypes = {
  terminalList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTerminal: PropTypes.arrayOf(PropTypes.string).isRequired,
  validationError: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  onCheckChange: PropTypes.func.isRequired,
};
AssociatedTerminals.defaultProps = {
  terminalList: [],
  selectedTerminal: [],
  validationError: "",
};
export function AssociatedTerminals({
  terminalList,
  selectedTerminal,
  validationError,
  onFieldChange,
  onCheckChange,
}) {
  //console.log("component terminalList", terminalList);
  if (selectedTerminal === null) selectedTerminal = [];
  return (
    <TranslationConsumer>
      {(t) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "80%" }}>
            <Select
              fluid
              placeholder={t("Common_Select")}
              label={t("TerminalCodes")}
              value={selectedTerminal}
              multiple={true}
              options={Utilities.transferListtoOptions(terminalList)}
              onChange={(data) => onFieldChange("TerminalCodes", data)}
              error={t(validationError)}
              disabled={terminalList.length === 0}
              reserveSpace={false}
            />
          </div>
          <div className="ddlSelectAll">
            <Checkbox
              label={t("Common_All")}
              checked={
                Array.isArray(selectedTerminal) &&
                selectedTerminal.length === terminalList.length
              }
              onChange={(checked) => onCheckChange(checked)}
            ></Checkbox>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
