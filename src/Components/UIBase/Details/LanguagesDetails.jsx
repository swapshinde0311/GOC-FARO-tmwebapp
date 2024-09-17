import React from "react";
import { Icon, Select } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";
import { DataTable } from "@scuf/datatable";

LanguagesDetails.propTypes = {
  selectedLanguageOptions: PropTypes.array.isRequired,
  availablelanguageOptions: PropTypes.array.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  languagesAddSelectionRows: PropTypes.array.isRequired,
  languagesDeleteSelectionRows: PropTypes.array.isRequired,
  handleAddRowSelectionChange: PropTypes.func.isRequired,
  handleDeleteRowSelectionChange: PropTypes.func.isRequired,
  addLanguages: PropTypes.func.isRequired,
  deleteLanguages: PropTypes.func.isRequired,
  handleAddAssociation: PropTypes.func.isRequired,
  onLanguagesSearchChange: PropTypes.func.isRequired,
  handleFoucsLanguagesChange: PropTypes.func.isRequired,
  // listOptions: PropTypes.shape({
  //   selectedLanguageOptions: PropTypes.array,
  //   availablelanguageOptions: PropTypes.array,
  // }).isRequired,
};

LanguagesDetails.defaultProps = {
  isEnterpriseNode: false,
};

export function LanguagesDetails({
  availablelanguageOptions,
  selectedLanguageOptions,
  languagesAddSelectionRows,
  languagesDeleteSelectionRows,
  handleAddRowSelectionChange,
  handleDeleteRowSelectionChange,
  addLanguages,
  deleteLanguages,
  handleAddAssociation,
  // listOptions,
  onLanguagesSearchChange,
  handleFoucsLanguagesChange,
}) {
  const [t] = useTranslation();
  const handleCustomEditDropDown = (cellData) => {
    return (
      <Select
        className="selectDropwdown"
        value={languagesAddSelectionRows}
        fluid
        options={availablelanguageOptions}
        onChange={(value) => handleAddRowSelectionChange(value, cellData)}
        indicator="required"
        reserveSpace={false}
        onFocus={handleFoucsLanguagesChange}
        search={true}
        noResultsMessage={t("noResultsMessage")}
        onSearch={onLanguagesSearchChange}
      />
    );
  };
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="shipmentTabAlignment">
          <div className="detailsContainer">
            <div className="row compartmentRow">
              <div className="col col-md-4 col-lg-3 col-xl-2"></div>
              <div
                className="col col-md-4 col-lg-3 col-xl-8"
                style={{ textAlign: "right" }}
              >
                <div className="compartmentIconContainer">
                  <div
                    onClick={handleAddAssociation}
                    className="compartmentIcon"
                  >
                    <div>
                      <Icon root="common" name="badge-plus" size="medium" />
                    </div>
                    <div className="margin_l10">
                      <h5 className="font14">{t("FinishedProductInfo_Add")}</h5>
                    </div>
                  </div>

                  <div
                    onClick={deleteLanguages}
                    className="compartmentIcon margin_l30"
                  >
                    <div>
                      <Icon root="common" name="delete" size="medium" />
                    </div>
                    <div className="margin_l10">
                      <h5 className="font14">{t("TerminalHolidays_Remove")}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 col-lg-2"></div>
              <div className="col-12 col-md-6 col-lg-8">
                <DataTable
                  data={selectedLanguageOptions}
                  selectionMode="single"
                  selection={languagesDeleteSelectionRows}
                  onSelectionChange={handleDeleteRowSelectionChange}
                  scrollable={true}
                  scrollHeight="400px"
                >
                  <DataTable.Column
                    sortable={true}
                    className="compColHeight"
                    key="LanguageName"
                    field="LanguageName"
                    header={t("Language_Select")}
                    editable={true}
                    editFieldType="text"
                    customEditRenderer={(celldata) =>
                      handleCustomEditDropDown(celldata)
                    }
                  ></DataTable.Column>
                </DataTable>
              </div>
              <div className="col-12 col-md-6 col-lg-2"></div>
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
