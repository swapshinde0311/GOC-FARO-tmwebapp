import React from "react";
import { TMUserActions } from "../../UIBase/Common/TMUserActions";
import "bootstrap/dist/css/bootstrap-grid.css";
export function TMUserActionsComposite({
  operationsVisibilty,
  breadcrumbItem,
  shareholders,
  selectedShareholder,
  onShareholderChange,
  onDelete,
  onAdd,
  popUpContent,
  shrVisible,
  handleBreadCrumbClick,
  addVisible,
  deleteVisible

}) {
  return (
    <TMUserActions
      operationsVisibilty={operationsVisibilty}
      breadcrumbItem={breadcrumbItem}
      shareholders={shareholders}
      selectedShareholder={selectedShareholder}
      onShareholderChange={onShareholderChange}
      onDelete={onDelete}
      onAdd={onAdd}
      popUpContent={popUpContent}
      shrVisible={shrVisible}
      handleBreadCrumbClick={handleBreadCrumbClick}
      addVisible={addVisible}
      deleteVisible={deleteVisible}
    ></TMUserActions>
  );
}
