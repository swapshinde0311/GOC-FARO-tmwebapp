import React from "react";
import { Modal, Button, Header } from "@scuf/common";
import TMReportViewer from "../Common/TMReportViewer";
import { useTranslation } from "@scuf/localization";
import PropTypes from "prop-types";

ReportDetails.propTypes = {
  proxyServerHost: PropTypes.string.isRequired,
  reportServiceHost: PropTypes.string.isRequired,
  filePath: PropTypes.string.isRequired,
  handleBack: PropTypes.func.isRequired,
  showReport: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  parameters: PropTypes.object.isRequired,
};
ReportDetails.defaultProps = {
  parameters: {},
};
export default function ReportDetails({
  proxyServerHost,
  reportServiceHost,
  filePath,
  handleBack,
  showReport,
  handleModalClose,
  parameters,
}) {
  const [t] = useTranslation();

  return (
    <Modal
      style={{ padding: "0px" }}
      size="fullscreen"
      open={showReport}
      // onClose={handleModalClose}
    >
      <div>
        <Header title={t("Header_TerminalManager")} menu={false} />
        <TMReportViewer
          proxyServerHost={proxyServerHost}
          reportServiceHost={reportServiceHost}
          filePath={filePath}
          parameters={parameters}
        />
        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
          <Button
            className="backButton"
            onClick={handleBack}
            content={t("Report_Back")}
          ></Button>
        </div>
      </div>
    </Modal>
  );
}
