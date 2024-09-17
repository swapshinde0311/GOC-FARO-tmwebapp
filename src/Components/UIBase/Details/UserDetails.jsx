import React from 'react';
import { Select, Input, Checkbox } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { getOptionsWithSelect } from "../../../JS/functionalUtilities";

UserDetails.propTypes = {
    user: PropTypes.object.isRequired,
    modUser: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        languageOptions: PropTypes.array,
        domainNameOptions: PropTypes.array,
        roleOptions: PropTypes.array,
        shareholderOptions: PropTypes.array,
        secondaryShareholderOptions: PropTypes.array,
        inheritedRolesOptions: PropTypes.array,
        inheritedRoles: PropTypes.array,
    }).isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    isDisableGroupANDMakeRoleMandatory: PropTypes.bool.isRequired,
}

UserDetails.defaultProps = {
    listOptions: {
        languageOptions: [],
        domainNameOptions: [],
        roleOptions: [],
        shareholderOptions: [],
        secondaryShareholderOptions: [],
        inheritedRolesOptions: [],
        inheritedRoles: []
    },
}

export function UserDetails({
    user,
    modUser,
    validationErrors,
    onFieldChange,
    listOptions,
    onActiveStatusChange,
    isDisableGroupANDMakeRoleMandatory,
}) {
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-md-12 mt-4" >
                            <p className="border-bottom-1 pb-2 deviceheaderLabel">{t("UserInfo_PersonalInformation")}</p>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modUser.FirstName}
                                indicator="required"
                                disabled={user.FirstName !== ""}
                                onChange={(data) => onFieldChange("FirstName", data)}
                                label={t("UserAdmin_FirstName")}
                                error={t(validationErrors.FirstName)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modUser.LastName}
                                indicator="required"
                                onChange={(data) => onFieldChange("LastName", data)}
                                label={t("UserAdmin_LastName")}
                                error={t(validationErrors.LastName)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder="Select"
                                value={modUser.Culture}
                                label={t("UserInfo_Language")}
                                options={listOptions.languageOptions}
                                onChange={(data) => onFieldChange("Culture", data)}
                                error={t(validationErrors.Culture)}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modUser.Phone}
                                onChange={(data) => onFieldChange("Phone", data)}
                                label={t("UserAdmin_PhoneNumber")}
                                error={t(validationErrors.Phone)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modUser.Mobile}
                                onChange={(data) => onFieldChange("Mobile", data)}
                                label={t("Cust_Mobile")}
                                error={t(validationErrors.Mobile)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modUser.Email}
                                onChange={(data) => onFieldChange("Email", data)}
                                label={t("Cust_Email")}
                                error={t(validationErrors.Email)}
                                reserveSpace={false}
                            />
                        </div>
                        {
                            modUser.RoleName === "BSIAdmin" ?
                                <div className="col-12 col-md-6 col-lg-4">
                                    <Input
                                        fluid
                                        value={modUser.ApplicationID}
                                        onChange={(data) => onFieldChange("ApplicationID", data)}
                                        label={t("Cust_ApplicationID")}
                                        error={t(validationErrors.ApplicationID)}
                                        reserveSpace={false}
                                    />
                                </div> : null
                        }
                    </div>
                    <div className="row">
                        <div className="col-md-12 mt-4" >
                            <p className="border-bottom-1 pb-2 deviceheaderLabel">{t("UserInfo_Account")}</p>
                        </div>
                        {modUser.DomainName === "1" ? (
                            <div className="col-12 col-md-6 col-lg-4">
                                <Input
                                    fluid
                                    value={modUser.NewDomainName}
                                    onChange={(data) => onFieldChange("NewDomainName", data)}
                                    label={t("UserInfo_DomainName")}
                                    error={t(validationErrors.NewDomainName)}
                                    reserveSpace={false}
                                    disabled={user.FirstName !== ""}
                                />
                            </div>
                        ) : (<div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder="Select"
                                value={modUser.DomainName}
                                label={t("UserInfo_DomainName")}
                                options={(listOptions.domainNameOptions)}
                                onChange={(data) => onFieldChange("DomainName", data)}
                                error={t(validationErrors.DomainName)}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                                disabled={user.FirstName !== ""}
                            />
                        </div>)
                        }
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modUser.UserAccount}
                                indicator="required"
                                disabled={user.FirstName !== ""}
                                onChange={(data) => onFieldChange("UserAccount", data)}
                                label={t("UserInfo_UserAccount")}
                                error={t(validationErrors.UserAccount)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modUser.Description}
                                onChange={(data) => onFieldChange("Description", data)}
                                label={t("Cust_Description")}
                                error={t(validationErrors.Description)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder="Select"
                                indicator={isDisableGroupANDMakeRoleMandatory ? "required" : ""}
                                value={modUser.RoleName}
                                label={t("UserAdmin_ExplicitRole")}
                                options={getOptionsWithSelect((listOptions.roleOptions), t("Common_Select"))}
                                onChange={(data) => onFieldChange("RoleName", data)}
                                error={t(validationErrors.RoleName)}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                value={listOptions.inheritedRoles}
                                label={t("UserInfo_InheritedRoles")}
                                options={listOptions.inheritedRolesOptions}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                                disabled={true}
                                multiple={true}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 checkboxSelect">
                            <Checkbox
                                label={t("UserInfo_ServiceUser")}
                                checked={modUser.IsServiceUser ? true : false}
                                onChange={(data) => onFieldChange("IsServiceUser", data)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 mt-4" >
                            <p className="border-bottom-1 pb-2 deviceheaderLabel">{t("ShareholderListx_HeaderLabel")}</p>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder="Select"
                                indicator="required"
                                value={modUser.PrimaryShareholder}
                                label={t("UserAdmin_PrimaryShareHolder")}
                                options={listOptions.shareholderOptions}
                                onChange={(data) => onFieldChange("PrimaryShareholder", data)}
                                error={t(validationErrors.PrimaryShareholder)}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder="Select"
                                value={modUser.SecondaryShareholders}
                                label={t("UserInfo_SecondaryShareholder")}
                                options={listOptions.secondaryShareholderOptions}
                                onChange={(data) => onFieldChange("SecondaryShareholders", data)}
                                error={t(validationErrors.SecondaryShareholders)}
                                reserveSpace={false}
                                multiple={true}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("BaseProductList_Status")}
                                value={modUser.Status}
                                options={[
                                    { text: t("ViewShipment_Ok"), value: true },
                                    { text: t("ViewShipmentStatus_Inactive"), value: false },
                                ]}
                                onChange={(data) => onActiveStatusChange(data)}
                                error={t(validationErrors.Status)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modUser.Remarks}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                label={t("BaseProductList_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modUser.Status !== user.Status ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>

                    </div>
                </div>
            )}
        </TranslationConsumer>
    )
}