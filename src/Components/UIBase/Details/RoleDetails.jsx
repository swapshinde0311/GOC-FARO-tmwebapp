import React from "react";
import { Select, Input, Checkbox, Button, Accordion } from "@scuf/common";
import { useTranslation, TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";

RoleDetails.propTypes = {
  role: PropTypes.object.isRequired,
  modRole: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  roleOptions: PropTypes.array.isRequired,
  handleCopyRoleAccess: PropTypes.func.isRequired,
  modMenuItems: PropTypes.array.isRequired,
  modFunctionGroupItems: PropTypes.array.isRequired,
  onCopyPermissionChange: PropTypes.func.isRequired,
  copyPermissionFromRole: PropTypes.string.isRequired,
  onFunctionGroupChange: PropTypes.func.isRequired,
};

RoleDetails.defaultProps = {
  modMenuItems: [],
  modFunctionGroupItems: [],
};

export function RoleDetails({
  role,
  modRole,
  validationErrors,
  onFieldChange,
  onVisibilityChange,
  roleOptions,
  handleCopyRoleAccess,
  modMenuItems,
  modFunctionGroupItems,
  copyPermissionFromRole,
  onCopyPermissionChange,
  onFunctionGroupChange,
}) {
  const [t] = useTranslation();

  const visibilityCheckbox = (data) => {
    return (
      <div className={data.rowData.IsModified ? "isModifiedCell" : ""}>
        <Checkbox
          checked={data.rowData.Visible === true ? true : false}
          onChange={(value) => onVisibilityChange(value, data)}
        />
      </div>
    );
  };

  const showMenuName = (cellData) => {
    let names = cellData.rowData.Name.split(">");
    return (
      <div>
        {names.map((item, index) => {
          if (names.length > index + 1)
            return <span style={{ color: "#a0a0a0" }}>{t(item) + " > "}</span>;
          else return <span>{t(item)}</span>;
        })}
      </div>
    );
  };

  const showMenuGroup = (cellData) => {
    try {
      let menu = cellData.rowData.MenuGroup;
      return (
        <div>
          {menu.map((menuNames) => {
            if (menuNames !== null) {
              let menuGroup = menuNames.split(">");
              return (
                <div>
                  {menuGroup.map((item, index) => {
                    if (menuGroup.length > index + 1)
                      return (
                        <span style={{ color: "#a0a0a0" }}>
                          {t(item) + " > "}
                        </span>
                      );
                    else return <span>{t(item)}</span>;
                  })}
                </div>
              );
            }
          })}
        </div>
      );
    } catch (error) {
      console.log("Error occured on showMenuGroup", error);
    }
  };

  const renderCheckbox = (cellData, type, isPassword) => {
    if (
      cellData.rowData.FunctionInfoList.length > 0 &&
      Array.isArray(cellData.rowData.FunctionInfoList)
    ) {
      let Item =
        type === "Add"
          ? cellData.rowData.FunctionInfoList.filter(
              (item) => item.FunctionName === "Add"
            )
          : type === "Modify"
          ? cellData.rowData.FunctionInfoList.filter(
              (item) => item.FunctionName === "Modify"
            )
          : type === "Remove"
          ? cellData.rowData.FunctionInfoList.filter(
              (item) => item.FunctionName === "Remove"
            )
          : cellData.rowData.FunctionInfoList.filter(
              (item) => item.FunctionName === "View"
            );

      if (Item.length > 0 && Array.isArray(Item)) {
        return (
          <div
            className={
              isPassword
                ? Item[0].IsPasswordModified
                  ? "isModifiedCell"
                  : ""
                : Item[0].FunctionProperties.IsModified
                ? "isModifiedCell"
                : ""
            }
          >
            <Checkbox
              disabled={
                isPassword ? false : !Item[0].FunctionProperties.Editable
              }
              checked={
                isPassword
                  ? Item[0].PasswordEnabled === true
                    ? true
                    : false
                  : Item[0].FunctionProperties.FunctionEnabled === true
                  ? true
                  : false
              }
              onChange={(value) =>
                isPassword
                  ? onFunctionGroupChange(
                      cellData.rowData.FunctionGroupName,
                      type,
                      value,
                      "Password"
                    )
                  : onFunctionGroupChange(
                      cellData.rowData.FunctionGroupName,
                      type,
                      value
                    )
              }
            />
          </div>
        );
      }
    }
  };

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRole.RoleName}
                indicator="required"
                disabled={role.RoleName !== ""}
                onChange={(data) => onFieldChange("RoleName", data)}
                label={t("RoleAdmin_RoleName")}
                error={t(validationErrors.RoleName)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modRole.Description}
                label={t("RoleAdmin_Description")}
                onChange={(data) => onFieldChange("Description", data)}
                error={t(validationErrors.Description)}
                reserveSpace={false}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Select
                fluid
                placeholder="Select"
                value={copyPermissionFromRole}
                label={t("RoleAdmin_CopyAccess")}
                options={getOptionsWithSelect(roleOptions, t("Common_Select"))}
                onChange={(data) => onCopyPermissionChange(data)}
                reserveSpace={false}
                search={true}
                onResultsMessage={t("noResultsMessage")}
              />
            </div>
            <div>
              <div
                className="col-12 col-md-6 col-lg-4"
                style={{ marginTop: "25px" }}
              >
                <Button
                  type="primary"
                  disabled={
                    copyPermissionFromRole === "" ||
                    copyPermissionFromRole === null
                  }
                  content={t("RoleAdminEdit_Apply")}
                  onClick={handleCopyRoleAccess}
                />
              </div>
            </div>
          </div>

          <Accordion>
            <Accordion.Content
              className="attributeAccordian"
              title={t("RoleAdmin_PageMenu")}
            >
              <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable roleDatatableHeight">
                  <DataTable
                    search={true}
                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                    data={modMenuItems}
                  >
                    <DataTable.Column
                      initialWidth="75%"
                      className="compColHeight"
                      key="Name"
                      field="Name"
                      header={t("RoleAdmin_MenuElement")}
                      renderer={showMenuName}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      initialWidth="25%"
                      className="compColHeight"
                      key="Visible"
                      field="Visible"
                      header={t("RoleAdmin_Visiblity")}
                      renderer={visibilityCheckbox}
                      editFieldType="text"
                    ></DataTable.Column>
                  </DataTable>
                </div>
              </div>
            </Accordion.Content>

            <Accordion.Content
              className="attributeAccordian"
              title={t("RoleAdmin_FunctionGroups")}
            >
              <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable roleDatatableHeight">
                  <DataTable
                    search={true}
                    searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                    data={modFunctionGroupItems}
                  >
                    <DataTable.Column
                      initialWidth="22%"
                      className="compColHeight"
                      header={t("Menu")}
                      renderer={showMenuGroup}
                    ></DataTable.Column>
                    <DataTable.Column
                      initialWidth="20%"
                      className="compColHeight"
                      key="FunctionGroupName"
                      field="FunctionGroupName"
                      header={t("RoleAdmin_Features")}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      initialWidth="5%"
                      className="compColHeight"
                      header={t("BayGroupList_Add")}
                      renderer={(cellData) =>
                        renderCheckbox(cellData, "Add", false)
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      initialWidth="7%"
                      className="compColHeight"
                      header={t("AccessCardInfo_x_Pwd")}
                      renderer={(cellData) =>
                        renderCheckbox(cellData, "Add", true)
                      }
                    ></DataTable.Column>

                    <DataTable.Column
                      initialWidth="5%"
                      className="compColHeight"
                      header={t("RoleAdmin_Modify")}
                      renderer={(cellData) =>
                        renderCheckbox(cellData, "Modify", false)
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      initialWidth="7%"
                      className="compColHeight"
                      header={t("AccessCardInfo_x_Pwd")}
                      renderer={(cellData) =>
                        renderCheckbox(cellData, "Modify", true)
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      initialWidth="5%"
                      className="compColHeight"
                      header={t("AccessCardInfo_Delete")}
                      renderer={(cellData) =>
                        renderCheckbox(cellData, "Remove", false)
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      initialWidth="7%"
                      className="compColHeight"
                      header={t("AccessCardInfo_x_Pwd")}
                      renderer={(cellData) =>
                        renderCheckbox(cellData, "Remove", true)
                      }
                    ></DataTable.Column>
                    <DataTable.Column
                      initialWidth="5%"
                      className="compColHeight"
                      header={t("RoleAdmin_View")}
                      renderer={(cellData) =>
                        renderCheckbox(cellData, "View", false)
                      }
                    ></DataTable.Column>
                  </DataTable>
                </div>
              </div>
            </Accordion.Content>
          </Accordion>
        </div>
      )}
    </TranslationConsumer>
  );
}
