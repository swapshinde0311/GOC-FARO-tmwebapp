import React from 'react';
import { Select, Input, Accordion,InputLabel,Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import PropTypes from "prop-types";
import { AssociatedTerminals } from "../Common/AssociatedTerminals";
import { AttributeDetails } from "../Details/AttributeDetails";
import ErrorBoundary from "../../ErrorBoundary";
import * as Constants from "../../../JS/Constants";
import * as Utilities from "../../../JS/Utilities";


CaptainDetails.propTypes = {
    captain: PropTypes.object.isRequired,
    modCaptain:PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    listOptions: PropTypes.shape({
        languageOptions: PropTypes.array,
        shareholders: PropTypes.array,
        terminalCodes: PropTypes.array,
    }).isRequired,
    onActiveStatusChange: PropTypes.func.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    onAllTerminalsChange: PropTypes.func.isRequired,
    attributeValidationErrors: PropTypes.array.isRequired,
    modAttributeMetaDataList: PropTypes.array.isRequired,
    onAttributeDataChange: PropTypes.func.isRequired,
    onShareholderChange: PropTypes.func.isRequired,
    userType: PropTypes.string.isRequired,
    onImageChange: PropTypes.func.isRequired,
    handleCheckIn: PropTypes.func.isRequired,
    handleCheckOut: PropTypes.func.isRequired,
    handleCheckInCheckOutHistory: PropTypes.func.isRequired,
    staffAttributeValidationErrors: PropTypes.array.isRequired,
    modStaffAttributeMetaDataList: PropTypes.array.isRequired,
    onStaffAttributeDataChange: PropTypes.func.isRequired,
    visitorAttributeValidationErrors: PropTypes.array.isRequired,
    modVisitorAttributeMetaDataList: PropTypes.array.isRequired,
    onVisitorAttributeDataChange: PropTypes.func.isRequired,
}

CaptainDetails.defaultProps = {
    listOptions: {
        languageOptions: [],
        shareholders: [],
        terminalCodes: [],
    },
    isEnterpriseNode: false
}


export function CaptainDetails({
    captain,
    modCaptain,
    validationErrors,
    onFieldChange,
    listOptions,
    onActiveStatusChange,
    isEnterpriseNode,
    onAllTerminalsChange,
    modAttributeMetaDataList,
    attributeValidationErrors,
    onShareholderChange,
    onAttributeDataChange,
    userType,
    onImageChange,
    handleCheckIn,
    handleCheckOut,
    handleCheckInCheckOutHistory,
    staffAttributeValidationErrors,
    modStaffAttributeMetaDataList,
    onStaffAttributeDataChange,
    visitorAttributeValidationErrors,
    modVisitorAttributeMetaDataList,
    onVisitorAttributeDataChange
}) {
    const handleValidationErrorFilter = (attributeValidationErrors, terminal) => {
        let attributeValidation = [];
        attributeValidation = attributeValidationErrors.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
        })
        return attributeValidation.attributeValidationErrors;
    }
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="detailsContainer">
                    {
                        (userType === Constants.GeneralTMUserType.StaffVisitor) ?
                        <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                          <InputLabel label={t("StaffOrVisitor_Image")} />
                          {modCaptain !== undefined &&
                          modCaptain.GeneralTMUserImage !== undefined &&
                          modCaptain.GeneralTMUserImage !== null &&
                          modCaptain.GeneralTMUserImage.length > 0 ? (
                            <img
                              height="100"
                              width="100"
                              alt=""
                              src={"data:image/jpg;base64," + modCaptain.GeneralTMUserImage}
                            />
                          ) : (
                            <img alt="" height="100" width="100" />
                          )}
                                    <br />
                                    <input
                              type="file"
                              accept="image/*"
                              name="image"
                              id="file"
                              onChange={onImageChange}
                            />
                        </div>
                      </div> : ("")
                    }
             
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value={modCaptain.Code}
                                indicator="required"
                                disabled= {captain.Code !== ""}
                                onChange={(data) => onFieldChange("Code", data)}
                                label={(userType === Constants.GeneralTMUserType.Captain) ? t("CaptainInfo_Code") : t("Staff_visitor_code")}
                                error={t(validationErrors.Code)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value={modCaptain.Name}
                                indicator="required"
                                onChange={(data) => onFieldChange("Name", data)}
                                label={(userType === Constants.GeneralTMUserType.Captain) ? t("CaptainInfo_CaptainName"):t("Staff_visitor_name")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                            />
                        </div>
                        {(userType === Constants.GeneralTMUserType.StaffVisitor) ?
                            <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modCaptain.UserType}
                                label={t("Staff_VisitorType")}
                                indicator="required"
                                options={[
                                    { text: Constants.CommonEntityType.Staff, value: Constants.CommonEntityType.Staff },
                                    { text: Constants.CommonEntityType.Visitor, value: Constants.CommonEntityType.Visitor },
                                ]}
                                onChange={(data) => {
                                    onFieldChange("UserType", data);
                                  }}
                                error={t(validationErrors.UserType)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                                disabled= {captain.Code !== ""}
                            />
                        </div>:("")
                        }
                        {(userType === Constants.GeneralTMUserType.Captain) ?
                            <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modCaptain.ShareholderCodes}
                                label={t("Shareholder_Captain")}
                                indicator="required"
                                options = {listOptions.shareholders}
                                onChange={(data) => {
                                    onFieldChange("ShareholderCodes", data);
                                  }}
                                error={t(validationErrors.ShareholderCodes)}
                                multiple={true}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>:("")
                        }
                        
                        {
                            (userType === Constants.GeneralTMUserType.Captain) ?
                            <div className= "col-12 col-md-6 col-lg-4">
                            <Select 
                                fluid
                                placeholder="Select"
                                value={modCaptain.LanguageCode}
                                label={t("CaptainInfo_Language")}
                                indicator="required"
                                options={listOptions.languageOptions}
                                onChange={(data) => onFieldChange("LanguageCode", data)}
                                error={t(validationErrors.LanguageCode)}
                                reserveSpace={false}
                                search={true}
                                onResultsMessage={t("noResultsMessage")}
                            />
                        </div>:("")
                        }
                        
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value={modCaptain.Phone === null ? "" : modCaptain.Phone}
                                onChange={(data) => onFieldChange("Phone", data)}
                                label={t("CaptainInfo_Phone")}
                                error={t(validationErrors.Phone)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value={modCaptain.Mobile === null ? "" : modCaptain.Mobile}
                                onChange={(data) => onFieldChange("Mobile", data)}
                                label={t("CaptainInfo_Mobile")}
                                error={t(validationErrors.Mobile)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value={modCaptain.MailID === null ? "" : modCaptain.MailID}
                                onChange={(data) => onFieldChange("MailID", data)}
                                label={t("CaptainInfo_EMail")}
                                error={t(validationErrors.MailID)}
                                reserveSpace={false}
                            />
                        </div>
                        {
                            (userType === Constants.GeneralTMUserType.StaffVisitor) ?
                                     <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value={listOptions.locationCode === null ? "" : listOptions.locationCode}
                                            label={t("StaffVisitor_Location")}
                                            disabled={true}
                                reserveSpace={false}
                            />
                                    </div> : ("")
                        }
                        {
                            (userType === Constants.GeneralTMUserType.StaffVisitor) ?
                            <div className="col-12 col-md-6 col-lg-4">
                            <Input 
                                fluid
                                value={listOptions.swipetime === null ? "" : listOptions.swipetime}
                                            label={t("StaffVisitor_SwipeTime")}
                                            disabled={true}
                                reserveSpace={false}
                            />
                                </div> : ("")
                        }
                        <div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                label={t("CaptainInfo_Status")}
                                value={modCaptain.Active}
                                options={[
                                    { text: t("CaptainInfo_Active"), value: true },
                                    { text: t("CaptainInfo_Inactive"), value: false },
                                ]}
                                onChange={(data) => onActiveStatusChange(data)}
                                error={t(validationErrors.Active)}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modCaptain.Remarks}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                label={t("CaptainInfo_Remarks")}
                                error={t(validationErrors.Remarks)}
                                indicator={modCaptain.Active !== captain.Active ? "required" : ""}
                                reserveSpace={false}
                            />
                        </div>
                        {isEnterpriseNode &&  (userType === Constants.GeneralTMUserType.Captain) ?
                            (<div className="col-12 col-md-6 col-lg-4">
                                <AssociatedTerminals
                                    terminalList={listOptions.terminalCodes}
                                    selectedTerminal={modCaptain.TerminalCodes}
                                    error={t(validationErrors.TerminalCodes)}
                                    onFieldChange={onFieldChange}
                                    onCheckChange={onAllTerminalsChange}
                                ></AssociatedTerminals>
                            </div>) : ("")}

                            {isEnterpriseNode &&  (userType === Constants.GeneralTMUserType.StaffVisitor) ?
                            (<div className="col-12 col-md-6 col-lg-4">
                            <Select
                                fluid
                                placeholder={t("Common_Select")}
                                value={modCaptain.TerminalCodes}
                                label={t("TerminalCodes")}
                                options = {Utilities.transferListtoOptions(listOptions.terminalCodes)}
                                    multiple={true}
                                    disabled={true}
                                reserveSpace={false}
                                search={true}
                                noResultsMessage={t("noResultsMessage")}
                            />
                            </div>) : ("")}
                    </div>

                    {
                        modAttributeMetaDataList.length > 0 ?
                        modAttributeMetaDataList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion >
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={onAttributeDataChange}
                                                attributeValidationErrors={handleValidationErrorFilter(attributeValidationErrors, attribute.TerminalCode)}
                                            ></AttributeDetails>
                                        </Accordion.Content>
                                    </Accordion>
                                </ErrorBoundary>
                            ) : null
                    }
                     {
                        modStaffAttributeMetaDataList.length > 0 ?
                        modStaffAttributeMetaDataList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion >
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={onStaffAttributeDataChange}
                                                attributeValidationErrors={handleValidationErrorFilter(staffAttributeValidationErrors, attribute.TerminalCode)}
                                            ></AttributeDetails>
                                        </Accordion.Content>
                                    </Accordion>
                                </ErrorBoundary>
                            ) : null
                    }
                     {
                        modVisitorAttributeMetaDataList.length > 0 ?
                        modVisitorAttributeMetaDataList.map((attribute) =>
                                <ErrorBoundary>
                                    <Accordion >
                                        <Accordion.Content
                                            className="attributeAccordian"
                                            title={isEnterpriseNode ? (attribute.TerminalCode + ' - ' + t("Attributes_Header")) : (t("Attributes_Header"))}
                                        >
                                            <AttributeDetails
                                                selectedAttributeList={attribute.attributeMetaDataList}
                                                handleCellDataEdit={onVisitorAttributeDataChange}
                                                attributeValidationErrors={handleValidationErrorFilter(visitorAttributeValidationErrors, attribute.TerminalCode)}
                                            ></AttributeDetails>
                                        </Accordion.Content>
                                    </Accordion>
                                </ErrorBoundary>
                            ) : null
                    }
                     {
                        (userType === Constants.GeneralTMUserType.StaffVisitor) ?
                            <div className="row">
                                <div className="col col-md-8 col-lg-9 col col-xl-12" style={{ textAlign: "right" }}>
                                <br></br>
                                <Button
                                    type="primary"
                                    onClick={handleCheckIn}
                                    disabled={captain.Code === "" || (isEnterpriseNode && Array.isArray(modCaptain.TerminalCodes) && modCaptain.TerminalCodes.length > 0)}
                                    content={t("StaffVisitor_checkIn")}
                                    ></Button>
                                    <Button
                                    type="primary"
                                    onClick={handleCheckOut}
                                    disabled={captain.Code === "" || (isEnterpriseNode && Array.isArray(modCaptain.TerminalCodes) && modCaptain.TerminalCodes.length > 0)}
                                    content={t("StaffVisitor_checkOut")}
                                    ></Button>
                                     <Button
                                    type="primary"
                                    onClick={handleCheckInCheckOutHistory}
                                    disabled={captain.Code === "" || (isEnterpriseNode && Array.isArray(modCaptain.TerminalCodes) && modCaptain.TerminalCodes.length > 0)}
                                    content={t("Staff_Visitor_Audit_Trail")}
                                ></Button>
                                </div>
                            </div> : ("")

                    }
                </div>
            )}
        </TranslationConsumer>
    )
}