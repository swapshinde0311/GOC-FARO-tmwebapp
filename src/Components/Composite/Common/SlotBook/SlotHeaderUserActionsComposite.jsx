import React from "react";
import { Breadcrumb, Select } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import ErrorBoundary from "../../../ErrorBoundary";
import PropTypes from "prop-types";
import * as Utilities from "../../../../JS/Utilities";
import "bootstrap/dist/css/bootstrap-grid.css";
SlotHeaderUserActionsComposite.propTypes = {
  operationsVisibilty: PropTypes.shape({
    //add: PropTypes.bool,
    terminal: PropTypes.bool,
  }).isRequired,
  breadcrumbItem: PropTypes.shape({
    itemName: PropTypes.string,
    itemCode: PropTypes.string,
    itemProps: PropTypes.any,
    localizedKey: PropTypes.string,
    parents: PropTypes.array,
    isComponent: PropTypes.bool,
  }).isRequired,
  terminals: PropTypes.array.isRequired,
  selectedTerminal: PropTypes.string.isRequired,
  onTerminalChange: PropTypes.func.isRequired,
  //onDelete: PropTypes.func.isRequired,
  //onAdd: PropTypes.func.isRequired,
  //popUpContent: PropTypes.array,
};
SlotHeaderUserActionsComposite.defaultProps = {
  operationsVisibilty: { add: false, delete: false, shareholder: false },
  breadcrumbItem: {
    itemName: "",
    itemCode: "",
    localizedKey: "",
    itemProps: {},
    parents: [],
    isComponent: false,
  },
  terminals: [],
  selectedTerminal: "",
  //popUpContent: [],
  //terminalVisible: true,
};
export function SlotHeaderUserActionsComposite({
  operationsVisibilty,
  breadcrumbItem,
  terminals,
  selectedTerminal,
  onTerminalChange,
  //onDelete,
  handleBreadCrumbClick,

  //popUpContent,
  //shrVisible,
}) {
  //const [modelOpen, setModelOpen] = useState(false);
  //const [popUpOpen, setPopUpOpen] = useState(false);
  function getTerminalDropdownOptions() {
    return Utilities.transferListtoOptions(terminals);
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
                  key={parentitem.itemCode}
                  onClick={() =>
                    handleBreadCrumbClick(
                      parentitem.itemCode,
                      breadcrumbItem.parents
                    )
                  }
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

  // function displayIcons() {
  //   return (
  //     <div style={{ float: "right", display: "inline-block" }}>
  //       <div
  //         className={
  //           (operationsVisibilty.add ? "iconCircle " : "iconCircleDisable ") +
  //           "iconblock"
  //         }
  //         onClick={onAdd}
  //       >
  //         <Icon root="common" name="badge-plus" size="small" color="white" />
  //       </div>

  //     </div>
  //   );
  // }

  //   function displayTMModalforDelete() {
  //     //console.log("entered to display modal actions");
  //     return (
  //       <TranslationConsumer>
  //         {(t) => (
  //           <Modal open={modelOpen} size="small">
  //             <Modal.Content>
  //               <div>
  //                 <b>{t("Confirm_Delete")}</b>
  //               </div>
  //             </Modal.Content>
  //             <Modal.Footer>
  //               <Button
  //                 type="secondary"
  //                 content={t("Cancel")}
  //                 onClick={() => setModelOpen(false)}
  //               />
  //               <Button
  //                 type="primary"
  //                 content={t("PipelineDispatch_BtnSubmit")}
  //                 onClick={() => {
  //                   setModelOpen(false);
  //                   onDelete();
  //                 }}
  //               />
  //             </Modal.Footer>
  //           </Modal>
  //         )}
  //       </TranslationConsumer>
  //     );
  //     //return <TMModal open={true}></TMModal>;
  //   }

  return (
    <div className="row" style={{ marginTop: "10px" }}>
      <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-7">
        <ErrorBoundary> {buildBreadcrumb()}</ErrorBoundary>
      </div>
      <div
        className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-5"
        //style={{ verticalAlign: "middle" }}
      >
        <TranslationConsumer>
          {(t) => (
            <div className="compartmentIcon">
              <div>
                <h4 className="shrText">{t("Common_Terminal")}:</h4>
              </div>
              <div className="opSelect">
                <Select
                  //className="opSelect"
                  placeholder={t("Common_Terminal")}
                  value={selectedTerminal}
                  disabled={!operationsVisibilty.terminal}
                  options={getTerminalDropdownOptions()}
                  onChange={(value) => onTerminalChange(value)}
                />
              </div>

              {/* {displayIcons()} */}
            </div>
          )}
        </TranslationConsumer>
      </div>
      {/* {displayTMModalforDelete()} */}
    </div>
  );
}
