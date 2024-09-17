import PropTypes from "prop-types";
import React, { useState } from "react";
import { Divider, Button, Icon } from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";

TransactionSummaryOperations.propTypes = {
  selectedItem: PropTypes.array,
  shipmentNextOperations: PropTypes.array,
  handleDetailsPageClick: PropTypes.func,
  handleOperationButtonClick: PropTypes.func.isRequired,
  currentStatuses: PropTypes.object,
  //lastStatus: PropTypes.string,
  isDetails: PropTypes.bool.isRequired,
  isEnterpriseNode: PropTypes.bool.isRequired,
  unAllowedOperations: PropTypes.array.isRequired,
};

export default function TransactionSummaryOperations({
  title,
  selectedItem,
  shipmentNextOperations,
  handleDetailsPageClick,
  handleOperationButtonClick,
  currentStatuses,
  //lastStatus,
  isDetails,
  isEnterpriseNode,
  unAllowedOperations,
  handleDrawer,
  isWebPortalUser,
  webPortalAllowedOperations,
}) {
  const [t] = useTranslation();

  const [drawerClassName, setDrawerClassName] = useState("");
  const isDisplayDrawer = () => {
    let className = drawerClassName;
    if (className === "") {
      className = "marineOperationDrawerShow";
    } else {
      className = "";
    }
    setDrawerClassName(className);
    handleDrawer();
  };

  const handleOperationButtons = () => {
    let btn = [];
    if (shipmentNextOperations) {
      shipmentNextOperations.forEach((operation) => {
        if (isEnterpriseNode && !isWebPortalUser) {
          if (!unAllowedOperations.includes(operation)) {
            btn.push(
              <>
                <br />
                <Button
                  type="secondary"
                  className="ViewShipmentButton"
                  onClick={() => handleOperationButtonClick(operation)}
                >
                  {t(operation)}
                </Button>
              </>
            );
          }
        } else if (isWebPortalUser) {
          if (webPortalAllowedOperations.includes(operation)) {
            btn.push(
              <>
                <br />
                <Button
                  type="secondary"
                  className="ViewShipmentButton"
                  onClick={() => handleOperationButtonClick(operation)}
                >
                  {t(operation)}
                </Button>
              </>
            );
          }
        } else {
          btn.push(
            <>
              <br />
              <Button
                type="secondary"
                className="ViewShipmentButton"
                onClick={() => handleOperationButtonClick(operation)}
              >
                {t(operation)}
              </Button>
            </>
          );
        }
      });
    }
    return btn;
  };
  const handleCompletedOperations = () => {
    try {
      let completedOperations = [];
      if (Object.keys(currentStatuses).length > 0)
        Object.keys(currentStatuses).forEach((statuses) => {
          let time = currentStatuses[statuses];

          let label = [];

          label.push(
            <>
              <label>{t(statuses)}</label>
            </>
          );
          label.push(
            <>
              {" "}
              <br />{" "}
              <label>
                {" "}
                {"(" +
                  new Date(time).toLocaleDateString() +
                  " " +
                  new Date(time).toLocaleTimeString() +
                  ")"}
              </label>
            </>
          );

          completedOperations.push(
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>{<>{label}</>}</TimelineContent>
            </TimelineItem>
          );
        });
      return completedOperations;
    } catch (error) {
      console.log(
        "TransactionSummaryOperations: handleCompletedOperations",
        error
      );
    }
  };

  return (
    <div className={"ViewShipmentStatusDetails " + drawerClassName}>
      <div
        className="marineDashboardDrawerButton"
        onClick={isDisplayDrawer}
        style={{ pointerEvents: "auto" }}
      >
        <Icon
          name={drawerClassName !== "" ? "menu-icon" : "close"}
          size="medium"
        // color="white"
        />
      </div>
      <div className="ViewShipmentStatusHeader">
        <h4>
          {t(title)} {selectedItem[0]["Common_Code"]}
        </h4>
      </div>
      <Divider />
      <div>
        <Timeline className="timelineAlignment">
          {<>{handleCompletedOperations()}</>}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot
                variant="outlined"
                className="inProgressOperations"
              />
              <TimelineConnector className="timelineConnector" />
            </TimelineSeparator>
            <TimelineContent>{<>{handleOperationButtons()}</>}</TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>
      {!isDetails ? (
        <div>
          <Button
            className="ViewShipmentDetailsButton"
            onClick={() => handleDetailsPageClick(selectedItem[0])}
          >
            {t("ViewAllShipment_DetailsPage")}
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
