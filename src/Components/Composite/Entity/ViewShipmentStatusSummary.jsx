import React from "react";
import PropTypes from "prop-types";
import { Divider, Button } from "@scuf/common";
import { useTranslation } from "@scuf/localization";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import * as Constants from "../../../JS/Constants";

ViewShipmentStatusSummary.propTypes = {
  selectedItem: PropTypes.array,
  shipmentNextOperations: PropTypes.array,
  handleDetailsPageClick: PropTypes.func.isRequired,
  handleOperationButtonClick: PropTypes.func.isRequired,
  currentShipmentStatuses: PropTypes.array,
  lastStatus: PropTypes.string,
};

export default function ViewShipmentStatusSummary({
  selectedItem,
  shipmentNextOperations,
  handleDetailsPageClick,
  handleOperationButtonClick,
  currentShipmentStatuses,
  lastStatus,
}) {
  const [t] = useTranslation();

  const handleOperationButtons = () => {
    let btn = [];
    btn.push(t(shipmentNextOperations[0]));
    shipmentNextOperations.map((operation) =>
      btn.push(
        <div key={operation}>
          <br />
          <Button
            type="secondary"
            className="ViewShipmentButton"
            onClick={() => handleOperationButtonClick(operation)}
          >
            {t(operation)}
          </Button>
        </div>
      )
    );
    return btn;
  };
  const handleCompletedOperations = () => {
    let completedOperations = [];
    currentShipmentStatuses.map((operation) =>
      operation.toUpperCase() === Constants.Shipment_Status.READY
        ? completedOperations.push(
            <TimelineItem key="ViewAllShipment_AuthorizedtoLoad">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewAllShipment_AuthorizedtoLoad")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Shipment_Status.CHECKED_IN
        ? completedOperations.push(
            <TimelineItem key="ViewAllShipment_AllowedtoLoad">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewAllShipment_AllowedtoLoad")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Shipment_Status.QUEUED
        ? lastStatus !== Constants.Shipment_Status.CLOSED
          ? completedOperations.push(
              <TimelineItem key="ViewAllShipment_PartiallyLoad">
                <TimelineSeparator>
                  <TimelineDot className="completedOperations" />
                  <TimelineConnector className="timelineConnector" />
                </TimelineSeparator>
                <TimelineContent>
                  {t("ViewAllShipment_PartiallyLoad")}
                </TimelineContent>
              </TimelineItem>
            )
          : completedOperations.push(
              <TimelineItem key="ViewAllShipment_ManuallyLoaded">
                <TimelineSeparator>
                  <TimelineDot className="completedOperations" />
                  <TimelineConnector className="timelineConnector" />
                </TimelineSeparator>
                <TimelineContent>
                  {t("ViewAllShipment_ManuallyLoaded")}
                </TimelineContent>
              </TimelineItem>
            )
        : operation.toUpperCase() === Constants.Shipment_Status.PARTIALLY_LOADED
        ? lastStatus === Constants.Shipment_Status.CLOSED &&
          currentShipmentStatuses.findIndex(
            (x) => x.toUpperCase() === Constants.Shipment_Status.MANUALLY_LOADED
          ) < 0
          ? completedOperations.push(
              <TimelineItem key="ViewAllShipment_ShipmentClosed">
                <TimelineSeparator>
                  <TimelineDot className="completedOperations" />
                  <TimelineConnector className="timelineConnector" />
                </TimelineSeparator>
                <TimelineContent>
                  {t("ViewAllShipment_ShipmentClosed")}
                </TimelineContent>
              </TimelineItem>
            )
          : ""
        : operation.toUpperCase() === Constants.Shipment_Status.MANUALLY_LOADED
        ? completedOperations.push(
            <TimelineItem key="ViewAllShipment_ShipmentClosed">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewAllShipment_ShipmentClosed")}
              </TimelineContent>
            </TimelineItem>
          )
        : ""
    );
    return completedOperations;
  };

  return (
    <div className="ViewShipmentStatusDetails">
      <div className="ViewShipmentStatusHeader">
        <h4>
          {t("ViewAllShipment_Details")} {selectedItem[0]["Common_Code"]}
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
      <div>
        <Button
          fliud
          className="ViewMarineDetailsButton"
          onClick={() => handleDetailsPageClick(selectedItem[0])}
        >
          {t("ViewAllShipment_DetailsPage")}
        </Button>
      </div>
    </div>
  );
}
