import React from "react";
import { Select, Input, Button, Icon } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import * as Constants from "../../../JS/Constants";

WebPortalUserMapDetails.propTypes = {
  webPortalUser: PropTypes.object.isRequired,
  modWebPortalUser: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  listOptions: PropTypes.shape({
    securityUsers: PropTypes.array,
  }).isRequired,
  userChange: PropTypes.func.isRequired,
  handleAvailableEntitySelection: PropTypes.func.isRequired,
  handleAssociatedEntitySelection: PropTypes.func.isRequired,
  handleEntityAssociation: PropTypes.func.isRequired,
  handleEntityDisassociation: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
};

WebPortalUserMapDetails.defaultProps = {
  listOptions: {
    securityUsers: [],
    availableEntities: [],
    selectedAvailableEntities: [],
    selectedAssociatedEntities: [],
  },
};
export function statusRenderer(cellData) {
  const data = cellData.value;
  if (typeof data === "boolean") {
    if (data) return <Icon name="check" size="small" color="green" />;
    else return <Icon name="close" size="small" color="red" />;
  }
}
export function WebPortalUserMapDetails({
  webPortalUser,
  modWebPortalUser,
  validationErrors,
  onFieldChange,
  listOptions,
  userChange,
  handleAvailableEntitySelection,
  handleAssociatedEntitySelection,
  handleEntityAssociation,
  handleEntityDisassociation,
  pageSize,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              {webPortalUser.UserName === "" ? (
                <Select
                  fluid
                  placeholder={t("Common_Select")}
                  label={t("WebPortal_Username")}
                  value={modWebPortalUser.UserName}
                  options={listOptions.securityUsers}
                  onChange={(data) => {
                    userChange(data);
                  }}
                  indicator="required"
                  error={t(validationErrors.UserName)}
                  reserveSpace={false}
                  search={true}
                  noResultsMessage={t("noResultsMessage")}
                />
              ) : (
                <Input
                  fluid
                  value={modWebPortalUser.UserName}
                  indicator="required"
                  disabled={true}
                  label={t("WebPortal_Username")}
                  error={t(validationErrors.UserName)}
                  reserveSpace={false}
                />
              )}
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modWebPortalUser.UserPrincipal}
                indicator="required"
                onChange={(data) => onFieldChange("UserPrincipal", data)}
                label={t("WebPortal_UserPrincipal")}
                error={t(validationErrors.UserPrincipal)}
                reserveSpace={false}
                disabled={webPortalUser.UserName !== ""}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modWebPortalUser.RoleName}
                label={t("WebPortal_Role")}
                reserveSpace={false}
                disabled={true}
              />
            </div>
          </div>

          {listOptions.availableEntities.length > 0 ||
          modWebPortalUser.WebPortalUserEntityItems.length > 0 ? (
            <div className="row">
              <div className="col-12 col-md-5 col-lg-5">
                <h4>{t("WebPortal_AvailableEntity")}</h4>
                <div className="detailsTable">
                  <DataTable
                    data={listOptions.availableEntities}
                    search={true}
                    selectionMode="multiple"
                    selection={listOptions.selectedAvailableEntities}
                    onSelectionChange={handleAvailableEntitySelection}
                    rows={pageSize}
                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                  >
                    <DataTable.Column
                      className="compColHeight"
                      key="Code"
                      field="Code"
                      header={t("WebPortal_Entity")}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="ShareholderCode"
                      field="ShareholderCode"
                      header={t("AccessCardInfo_Shareholder")}
                      editFieldType="text"
                    ></DataTable.Column>
                    {Array.isArray(listOptions.availableEntities) &&
                    listOptions.availableEntities.length > pageSize ? (
                      <DataTable.Pagination />
                    ) : (
                      ""
                    )}
                  </DataTable>
                </div>
              </div>

              <div className="col-12 col-md-2 col-lg-2">
                <br></br>
                <br></br>
                <div style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    icon={<Icon name="caret-right" root="common" />}
                    content=""
                    iconPosition="right"
                    onClick={handleEntityAssociation}
                    disabled={
                      modWebPortalUser.RoleName ===
                      Constants.WebPortalRoles.SHAREHOLDER
                    }
                  />
                  <br></br>
                  <br></br>

                  <Button
                    type="primary"
                    icon={<Icon name="caret-left" root="common" />}
                    content=""
                    iconPosition="right"
                    onClick={handleEntityDisassociation}
                    disabled={
                      modWebPortalUser.RoleName ===
                      Constants.WebPortalRoles.SHAREHOLDER
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-md-5 col-lg-5">
                <h4>{t("WebPortal_AssociatedEntity")}</h4>
                <div className="detailsTable">
                  <DataTable
                    data={modWebPortalUser.WebPortalUserEntityItems}
                    search={true}
                    selectionMode="multiple"
                    selection={listOptions.selectedAssociatedEntities}
                    onSelectionChange={handleAssociatedEntitySelection}
                    rows={pageSize}
                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                  >
                    <DataTable.Column
                      className="compColHeight"
                      key="Code"
                      field="Code"
                      header={t("WebPortal_Entity")}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="ShareholderCode"
                      field="ShareholderCode"
                      header={t("AccessCardInfo_Shareholder")}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight"
                      key="IsEntityActive"
                      field="IsEntityActive"
                      header={t("TankGroupInfo_Active")}
                      editable={false}
                      renderer={statusRenderer}
                      editFieldType="text"
                    ></DataTable.Column>
                    {Array.isArray(modWebPortalUser.WebPortalUserEntityItems) &&
                    modWebPortalUser.WebPortalUserEntityItems.length >
                      pageSize ? (
                      <DataTable.Pagination />
                    ) : (
                      ""
                    )}
                  </DataTable>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </TranslationConsumer>
  );
}
