import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import { Popup, List, Icon } from "@scuf/common";
import PropTypes from "prop-types";

TMDetailsHeader.propTypes = {
  entityCode: PropTypes.string,
  newEntityName: PropTypes.string,
  popUpContents: PropTypes.arrayOf(
    PropTypes.shape({
      fieldName: PropTypes.string,
      fieldValue: PropTypes.string,
    })
  ),
};
TMDetailsHeader.defaultProps = {
  entityCode: "",
  newEntityName: "",
  popUpContents: [],
};

export function TMDetailsHeader({ entityCode, newEntityName, popUpContents }) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="headerContainer">
          <div className="row headerSpacing">
            <div className="col paddingHeaderItemLeft">
              <span style={{ margin: "auto" }} className="headerLabel">
                {entityCode === "" || entityCode === undefined                 
                  ? t(newEntityName)
                  : entityCode}
              </span>
            </div>
            {entityCode !== "" &&
            entityCode !== undefined &&
            popUpContents.length > 0 ? (
              <div className="headerItemRight">
                <Popup
                  element={
                    <div>
                      {t(popUpContents[0].fieldName) + " "}:
                      {" " + popUpContents[0].fieldValue}
                      <Icon
                        style={{ marginLeft: "10px" }}
                        root="common"
                        name="caret-down"
                        size="small"
                      />
                    </div>
                  }
                  position="bottom left"
                  // on="click"
                >
                  <List className="detailsHeaderPopUp">
                    {popUpContents.map((content) => (
                      <List.Content
                        key="content.fieldName"
                        className="detailsHeaderPopUpListPadding"
                      >
                        {t(content.fieldName) + " "}:{" " + content.fieldValue}
                      </List.Content>
                    ))}
                  </List>
                </Popup>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}

export default TMDetailsHeader;