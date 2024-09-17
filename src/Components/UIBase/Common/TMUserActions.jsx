import React, { useState } from "react";
import {
  Icon,
  Breadcrumb,
  Select,
  Modal,
  Button,
  Popup,
  VerticalMenu,
} from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import * as Utilities from "../../../JS/Utilities";
TMUserActions.propTypes = {
  operationsVisibilty: PropTypes.shape({
    add: PropTypes.bool,
    delete: PropTypes.bool,
    shareholder: PropTypes.bool,
  }).isRequired,
  breadcrumbItem: PropTypes.shape({
    itemName: PropTypes.string,
    itemCode: PropTypes.string,
    itemProps: PropTypes.any,
    localizedKey: PropTypes.string,
    parents: PropTypes.array,
    isComponent: PropTypes.bool,
  }).isRequired,
  shareholders: PropTypes.array.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  onShareholderChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  popUpContent: PropTypes.array,
};
TMUserActions.defaultProps = {
  operationsVisibilty: { add: false, delete: false, shareholder: false },
  breadcrumbItem: {
    itemName: "",
    itemCode: "",
    localizedKey: "",
    itemProps: {},
    parents: [],
    isComponent: false,
  },
  shareholders: [],
  selectedShareholder: "",
  popUpContent: [],
  shrVisible: true,
  addVisible: true,
  deleteVisible: true
};
export function TMUserActions({
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
  const [modelOpen, setModelOpen] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);
  function getShareholderDropdownOptions() {
    return Utilities.transferListtoOptions(shareholders);
    // var List = [];
    // shareholders.forEach((element) => {
    //   List.push({ text: element, value: element });
    // });
    // return List;
  }

  function buildBreadcrumb() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Breadcrumb>
            {breadcrumbItem.parents.map((parentitem) => {
              return (
                <Breadcrumb.Item
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
                  key={parentitem.itemCode}
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
  function handlePopUpClick() {
    if (operationsVisibilty.add) {
      if (popUpContent.length > 0) {
        if (popUpOpen === false) setPopUpOpen(true);
        else setPopUpOpen(false);
      } else {
        onAdd();
      }
    }
  }

  function popUpMenuClick(menuItem) {
    setPopUpOpen(false);
    onAdd(menuItem);
  }
  function displayIcons() {
    return (
      <div
        style={{ float: "right", display: "inline-block", marginTop: "10px" }}
      >
        {addVisible ? <Popup
          position="bottom right"
          className="popup-theme-wrap"
          element={
            <div
              className={
                (operationsVisibilty.add
                  ? "iconCircle "
                  : "iconCircleDisable ") + "iconblock"
              }
              onClick={handlePopUpClick}
            >
              <Icon
                root="common"
                name="badge-plus"
                size="small"
                color="white"
              />
            </div>
          }
          on="click"
          open={popUpOpen}
        >
          <div onMouseLeave={() => setPopUpOpen(false)}>
            <TranslationConsumer>
              {(t) => (
                <VerticalMenu>
                  <VerticalMenu>
                    <VerticalMenu.Header>
                      {t("Common_Create")}
                    </VerticalMenu.Header>
                    {popUpContent.map((item) => {
                      return (
                        <VerticalMenu.Item
                          onClick={() => popUpMenuClick(item.fieldName)}
                        >
                          {t(item.fieldValue)}
                        </VerticalMenu.Item>
                      );
                    })}
                  </VerticalMenu>
                </VerticalMenu>
              )}
            </TranslationConsumer>
          </div>
        </Popup> : ""}
        {deleteVisible ? <div
          style={{ marginLeft: "10px" }}
          onClick={() => {
            if (operationsVisibilty.delete) {
              setModelOpen(true);
              //displayTMModalforDelete();
              //onDelete();
            }
          }}
          className={
            (operationsVisibilty.delete
              ? "iconCircle "
              : "iconCircleDisable ") + "iconblock"
          }
        >
          <Icon root="common" name="delete" size="small" color="white" />
        </div> : ""}

      </div>
    );
  }

  function displayTMModalforDelete() {
    //console.log("entered to display modal actions");
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={modelOpen} size="small">
            <Modal.Content>
              <div>
                <b>{t("Confirm_Delete")}</b>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="secondary"
                content={t("Cancel")}
                onClick={() => setModelOpen(false)}
              />
              <Button
                type="primary"
                content={t("PipelineDispatch_BtnSubmit")}
                onClick={() => {
                  setModelOpen(false);
                  onDelete();
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
    //return <TMModal open={true}></TMModal>;
  }

  return (
    <div className="row" style={{ alignItems: "flex-start", padding: "0px" }}>
      <div
        className="col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10"
        style={{ padding: "0px" }}
      >
        <div className="row" style={{ marginTop: "10px", alignItems: "" }}>
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8">
            <ErrorBoundary> {buildBreadcrumb()}</ErrorBoundary>
          </div>
          <div
            className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4"
          //style={{ verticalAlign: "middle" }}
          >
            <TranslationConsumer>
              {(t) => (
                <div
                  className="compartmentIcon"
                  style={{ justifyContent: "flex-start" }}
                >
                  {shrVisible === false ? (
                    ""
                  ) : (
                    <>
                      <div>
                        <h4 className="shrText">{t("Common_Shareholder")}:</h4>
                      </div>
                      <div className="opSelect">
                        <Select
                          //className="opSelect"
                          placeholder={t("Common_Shareholder")}
                          value={selectedShareholder}
                          disabled={!operationsVisibilty.shareholder}
                          options={getShareholderDropdownOptions()}
                          onChange={(value) => onShareholderChange(value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </TranslationConsumer>
          </div>

          {displayTMModalforDelete()}
        </div>
      </div>
      <div className="col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2">
        {displayIcons()}
      </div>
    </div>
  );
}
