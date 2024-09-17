import React from "react";
import { HSEUserActions } from "../../UIBase/Common/HSEUserActions";
import "bootstrap/dist/css/bootstrap-grid.css";

export function HSEUserActionsComposite({
  operationsVisibilty,
  breadcrumbItem,
  terminals,
  selectedTerminal,
  onTerminalChange,
  onDelete,
  onAdd,
  terminalVisible,
  handleBreadCrumbClick,
  addVisible,
  deleteVisible

}) {
  return (
    <HSEUserActions
      operationsVisibilty={operationsVisibilty}
      breadcrumbItem={breadcrumbItem}
      terminals={terminals}
      selectedTerminal={selectedTerminal}
      onTerminalChange={onTerminalChange}
      onDelete={onDelete}
      onAdd={onAdd}
      terminalVisible={terminalVisible}
      handleBreadCrumbClick={handleBreadCrumbClick}
      addVisible={addVisible}
      deleteVisible={deleteVisible}
    ></HSEUserActions>
  );
}

 