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

ViewDispatchStatusSummary.propTypes = {
  selectedItem: PropTypes.array,
  shipmentNextOperations: PropTypes.array,
  handleDetailsPageClick: PropTypes.func.isRequired,
  handleOperationButtonClick: PropTypes.func.isRequired,
  currentShipmentStatuses: PropTypes.array,
  lastStatus: PropTypes.string,
  isDetailsPage: PropTypes.bool,
};

export default function ViewDispatchStatusSummary({
  selectedItem,
  shipmentNextOperations,
  handleDetailsPageClick,
  handleOperationButtonClick,
  currentShipmentStatuses,
  lastStatus,
  marineDispatchBtnStatus,
  isDetailsPage,
}) {
  const [t] = useTranslation();

  const handleOperationButtons = () => {
    let btn = [];
    btn.push(
      lastStatus.toUpperCase() === Constants.Shipment_Status.READY
        ? t("ViewAllShipment_Ready")
        : lastStatus.toUpperCase() === Constants.Shipment_Status.QUEUED
        ? t("ViewMarineDispatch_Queued")
        : lastStatus.toUpperCase() === Constants.Shipment_Status.LOADING
        ? t("ViewMarineDispatch_Loaded")
        : lastStatus.toUpperCase() ===
          Constants.Shipment_Status.PARTIALLY_LOADED
        ? t("ViewMarineDispatch_Partially_Loaded")
        : lastStatus.toUpperCase() === Constants.Shipment_Status.INTERRUPTED
        ? t("ViewMarineDispatch_Interrupted")
        : lastStatus.toUpperCase() === Constants.Shipment_Status.MANUALLY_LOADED
        ? t("ViewMarineDispatch_Manually_Loaded")
        : lastStatus.toUpperCase() === Constants.Shipment_Status.AUTO_LOADED
        ? t("ViewMarineDispatch_Auto_Loaded")
        : lastStatus.toUpperCase() === Constants.Shipment_Status.CLOSED
        ? t("ViewAllShipment_CLOSED")
        : ""
    );
    shipmentNextOperations.map((operation) =>
      btn.push(
        <div key={operation}>
          {/*<br />*/}
          <Button
            type="secondary"
            className="ViewShipmentButton"
            onClick={() => handleOperationButtonClick(operation)}
            disabled={marineDispatchBtnStatus}
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
            <TimelineItem key="ViewAllShipment_Ready">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>{t("ViewAllShipment_Ready")}</TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Shipment_Status.QUEUED
        ? completedOperations.push(
            <TimelineItem key="ViewMarineDispatch_Queued">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineDispatch_Queued")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Shipment_Status.LOADING
        ? completedOperations.push(
            <TimelineItem key="ViewMarineDispatch_Loaded">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineDispatch_Loaded")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Shipment_Status.PARTIALLY_LOADED
        ? completedOperations.push(
            <TimelineItem key="ViewMarineDispatch_Partially_Loaded">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineDispatch_Partially_Loaded")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Shipment_Status.INTERRUPTED
        ? completedOperations.push(
            <TimelineItem key="ViewMarineDispatch_Interrupted">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineDispatch_Interrupted")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Shipment_Status.MANUALLY_LOADED
        ? completedOperations.push(
            <TimelineItem key="ViewMarineDispatch_Manually_Loaded">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineDispatch_Manually_Loaded")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Shipment_Status.AUTO_LOADED
        ? completedOperations.push(
            <TimelineItem key="ViewMarineDispatch_Auto_Loaded">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineDispatch_Auto_Loaded")}
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
          {selectedItem[0]["Common_Code"] !== undefined &&
          selectedItem[0]["Common_Code"] !== null
            ? t("ViewAllShipment_Details") + selectedItem[0]["Common_Code"]
            : ""}
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
        {isDetailsPage ? (
          <Button
            fluid
            className="ViewMarineDetailsButton"
            onClick={() => handleDetailsPageClick(selectedItem[0])}
          >
            {t("ViewAllShipment_DetailsPage")}
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
