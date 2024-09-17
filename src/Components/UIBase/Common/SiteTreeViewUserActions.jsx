import React from "react";
import PropTypes from "prop-types";
import { Breadcrumb, Select } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import * as Utilities from "../../../JS/Utilities";

SiteTreeViewUserActions.propTypes = {
  operationsVisibilty: PropTypes.shape({
    terminal: PropTypes.bool,
  }).isRequired,
  breadcrumbItem: PropTypes.shape({
    itemName: PropTypes.string,
    itemCode: PropTypes.string,
    itemProps: PropTypes.any,
    localizedKey: PropTypes.string,
    parents: PropTypes.array,
    isComponent: PropTypes.bool,
  }).isRequired,
  terminals: PropTypes.array.isRequired,
  selectedTerminal: PropTypes.string.isRequired,
  onTerminalChange: PropTypes.func.isRequired,
};
SiteTreeViewUserActions.defaultProps = {
  breadcrumbItem: {
    itemName: "",
    itemCode: "",
    localizedKey: "",
    itemProps: {},
    parents: [],
    isComponent: false,
  },
  terminals: [],
  selectedTerminal: "",
};
export function SiteTreeViewUserActions({
  operationsVisibilty,
  breadcrumbItem,
  terminals,
  selectedTerminal,
  onTerminalChange,
  handleBreadCrumbClick,
}) {
  function getTerminalDropdownOptions() {
    return Utilities.transferListtoOptions(terminals);
  }

  function buildBreadcrumb() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Breadcrumb>
            {breadcrumbItem.parents.map((parentitem) => {
              return (
                <Breadcrumb.Item
                  key={parentitem.itemCode}
                  onClick={() => {
                    if (
                      handleBreadCrumbClick !== undefined &&
                      handleBreadCrumbClick !== null
                    ) {
                      handleBreadCrumbClick(
                        parentitem.itemCode,
                        breadcrumbItem.parents
                      );
                    }
                  }}
                >
                  {t(parentitem.localizedKey)}
                </Breadcrumb.Item>
              );
            })}
            <Breadcrumb.Item key={breadcrumbItem.itemCode}>
              {t(breadcrumbItem.localizedKey)}
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
      </TranslationConsumer>
    );
  }
  return (
    <div className="row" style={{ marginTop: "10px" }}>
      <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-7">
        <ErrorBoundary> {buildBreadcrumb()}</ErrorBoundary>
      </div>
      <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-5">
        <TranslationConsumer>
          {(t) => (
            <div className="compartmentIcon">
              <div>
                <h4 className="shrText">{t("Common_Terminal")}:</h4>
              </div>
              <div className="opSelect">
                <Select
                  placeholder={t("Common_Terminal")}
                  value={selectedTerminal}
                  disabled={!operationsVisibilty.terminal}
                  options={getTerminalDropdownOptions()}
                  onChange={(value) => onTerminalChange(value)}
                />
              </div>
            </div>
          )}
        </TranslationConsumer>
      </div>
    </div>
  );
}
