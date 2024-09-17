import React from "react";
import "bootstrap/dist/css/bootstrap-grid.css";
import { TMConfirmationModel } from "../../UIBase/Common/TMConfirmationModel";
export function TMUserActionsForDeleteComposite({
  onDelete,
  isShowDeleteComposite,
  confirmDeleteText,
  cancelText,
  submitText
}) {
  return (
    <TMConfirmationModel
      onConfirm={onDelete}
      isShow={isShowDeleteComposite}
      confirmText={confirmDeleteText}
      cancelText={cancelText}
      submitText={submitText}
    ></TMConfirmationModel>
  );
}
