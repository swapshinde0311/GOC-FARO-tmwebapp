import React from "react";
import { SiteTreeViewUserActions } from "../../UIBase/Common/SiteTreeViewUserActions";
import "bootstrap/dist/css/bootstrap-grid.css";

export function SiteTreeViewUserActionsComposite({
  breadcrumbItem,
  operationsVisibilty,
  terminals,
  selectedTerminal,
  onTerminalChange,
  handleBreadCrumbClick,
}) {
  return (
    <SiteTreeViewUserActions
      operationsVisibilty={operationsVisibilty}
      breadcrumbItem={breadcrumbItem}
      terminals={terminals}
      selectedTerminal={selectedTerminal}
      onTerminalChange={onTerminalChange}
      handleBreadCrumbClick={handleBreadCrumbClick}
    ></SiteTreeViewUserActions>
  );
}
