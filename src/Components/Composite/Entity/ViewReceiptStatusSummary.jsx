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

ViewReceiptStatusSummary.propTypes = {
  selectedItem: PropTypes.object,
  receiptNextOperations: PropTypes.array,
  handleDetailsPageClick: PropTypes.func.isRequired,
  handleOperationButtonClick: PropTypes.func.isRequired,
  currentReceiptStatuses: PropTypes.array,
  lastStatus: PropTypes.string,
};

export default function ViewReceiptStatusSummary({
  selectedItem,
  receiptNextOperations,
  handleDetailsPageClick,
  handleOperationButtonClick,
  currentReceiptStatuses,
  lastStatus,
  marineReceiptBtnStatus,
  pageStatus,
}) {
  const [t] = useTranslation();

  const handleOperationButtons = () => {
    let btn = [];
    btn.push(
      lastStatus.toUpperCase() === Constants.Receipt_Status.READY
        ? t("ViewAllShipment_Ready")
        : lastStatus.toUpperCase() === Constants.Receipt_Status.QUEUED
        ? t("ViewMarineDispatch_Queued")
        : lastStatus.toUpperCase() === Constants.Receipt_Status.UNLOADING
        ? t("ViewMarineReceipt_UnLoaded")
        : lastStatus.toUpperCase() ===
          Constants.Receipt_Status.PARTIALLY_UNLOADED
        ? t("ViewMarineReceipt_Partially_UnLoaded")
        : lastStatus.toUpperCase() === Constants.Receipt_Status.INTERRUPTED
        ? t("ViewMarineDispatch_Interrupted")
        : lastStatus.toUpperCase() ===
          Constants.Receipt_Status.MANUALLY_UNLOADED
        ? t("ViewMarineReceipt_Manually_UnLoaded")
        : lastStatus.toUpperCase() === Constants.Receipt_Status.AUTO_UNLOADED
        ? t("ViewMarineReceipt_Auto_Loaded")
        : lastStatus.toUpperCase() === Constants.Receipt_Status.CLOSED
        ? t("ViewAllShipment_CLOSED")
        : ""
    );
    receiptNextOperations.map((operation) =>
      btn.push(
        <div key={operation}>
          {/* <br /> */}
          <Button
            type="secondary"
            className="ViewShipmentButton"
            onClick={() => handleOperationButtonClick(operation)}
            disabled={marineReceiptBtnStatus}
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
    currentReceiptStatuses.map((operation) =>
      operation.toUpperCase() === Constants.Receipt_Status.READY
        ? completedOperations.push(
            <TimelineItem key="ViewAllShipment_Ready">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>{t("ViewAllShipment_Ready")}</TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Receipt_Status.QUEUED
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
        : operation.toUpperCase() === Constants.Shipment_Status.UNLOADING
        ? completedOperations.push(
            <TimelineItem key="ViewMarineReceipt_UnLoaded">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineReceipt_UnLoaded")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() ===
          Constants.Receipt_Status.PARTIALLY_UNLOADED
        ? completedOperations.push(
            <TimelineItem key="ViewMarineReceipt_Partially_UnLoaded">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineReceipt_Partially_UnLoaded")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Receipt_Status.INTERRUPTED
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
        : operation.toUpperCase() === Constants.Receipt_Status.MANUALLY_UNLOADED
        ? completedOperations.push(
            <TimelineItem key="ViewMarineReceipt_Manually_UnLoaded">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineReceipt_Manually_UnLoaded")}
              </TimelineContent>
            </TimelineItem>
          )
        : operation.toUpperCase() === Constants.Receipt_Status.AUTO_UNLOADED
        ? completedOperations.push(
            <TimelineItem key="ViewMarineReceipt_Auto_UnLoaded">
              <TimelineSeparator>
                <TimelineDot className="completedOperations" />
                <TimelineConnector className="timelineConnector" />
              </TimelineSeparator>
              <TimelineContent>
                {t("ViewMarineReceipt_Auto_UnLoaded")}
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
          {selectedItem["Common_Code"] !== undefined &&
          selectedItem["Common_Code"] !== null
            ? t("ViewAllReceipt_Details") + selectedItem["Common_Code"]
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
        {pageStatus ? (
          <Button
            className="ViewMarineDetailsButton"
            onClick={() => handleDetailsPageClick(selectedItem)}
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
