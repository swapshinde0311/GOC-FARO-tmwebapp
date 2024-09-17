import React from "react";
import * as WjCore from "@grapecity/wijmo";
import { ReportViewer } from "@grapecity/wijmo.react.viewer";
import * as wjViewer from "@grapecity/wijmo.viewer";
import "@grapecity/wijmo.styles/wijmo.css";
import PropTypes from "prop-types";
import * as Constants from "./../../../JS/Constants";
import { connect } from "react-redux";

TMReportViewer.propTypes = {
  proxyServerHost: PropTypes.string.isRequired,
  reportServiceHost: PropTypes.string.isRequired,
  parameters: PropTypes.object.isRequired,
};

TMReportViewer.defaultProps = {
  parameters: {},
};

WjCore.setLicenseKey(Constants.wizmoKey);

function TMReportViewer({
  proxyServerHost,
  reportServiceHost,
  parameters,
  filePath,
  ...props
}) {
  //   const [proxyHost, setProxyHost] = useState(
  //     "http://localhost:8888/TMWebProxyAPI/"
  //   );
  //   const [reportServiceHost, setReportServiceHost] = useState(
  //     "http://localhost:5632/"
  //   );
  //   const [reportUrl, setReportUrl] = useState(proxyHost + "api/report");
  //   const [filePath, setFilePath] = useState(
  //     "TM/" + "TMReports/" + "CarrierCompanyReport"
  //   );
  const reportUrl = proxyServerHost + "api/report";
  //const filePath = "TM/" + "TMReports/" + reportName;

  const beforeXhrRequestSend = (s, event) => {
    // use this event for Authorization purpose
    const prevBeforeSend = event.settings.beforeSend;
    event.settings.beforeSend = function (xhr) {
      prevBeforeSend && prevBeforeSend(xhr);
      //here you may add the params for XMLHttpRequest as required
      if (!props.userDetails.EntityResult.IsWebPortalUser)
        xhr.withCredentials = true;
      if (xhr.URL_DEBUG.indexOf("parameters") > -1) {
        xhr.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            var host = s.hostElement;
            setTimeout(() => {
              var splitter = host.querySelector(".wj-viewer-splitter");
              var param = host
                .querySelector(".wj-viewer-tabsleft")
                .querySelectorAll("li")[2];
              if (!param.disabled) {
                param.className = "hidden";
                splitter.click();
              }
            }, 1000);
          }
        };
      }
    };
  };
  let header = {
    Authorization: "Bearer " + props.tokenDetails.tokenInfo,
  };

  // let header = {
  //   Authorization: "Bearer " + "fiewjfjewifi",
  // };

  const initViewer = (s, event) => {
    wjViewer._ReportService.prototype.load = function (data) {
      var _this = this;
      var promise = new wjViewer._Promise();
      if (!this._checkReportController(promise)) {
        return promise;
      }
      this.httpRequest(this._getReportInstancesUrl(), {
        method: "POST",
        data: data,
      }).then(
        function (xhr) {
          var v = wjViewer._parseReportExecutionInfo(xhr.responseText);
          _this._instanceId = v.id;
          _this._status = wjViewer._ExecutionStatus.loaded;
          _this._outlinesLocation = v.outlinesLocation;
          _this._statusLocation = v.statusLocation.replace(
            reportServiceHost,
            proxyServerHost
          );
          _this._pageSettingsLocation = v.pageSettingsLocation;
          _this._featuresLocation = v.featuresLocation;
          _this._parametersLocation = v.parametersLocation;
          promise.resolve(v);
        },
        function (xhr) {
          promise.reject(_this._getError(xhr));
        }
      );
      return promise;
    };
  };

  //console.log(props.userDetails.EntityResult.IsWebPortalUser, header);
  return (
    <div>
      {props.userDetails.EntityResult.IsWebPortalUser ? (
        <div>
          <ReportViewer
            requestHeaders={header}
            style={{ height: "80vh" }}
            parameters={parameters}
            serviceUrl={reportUrl}
            filePath={filePath}
            initialized={initViewer}
            beforeSendRequest={beforeXhrRequestSend}
          />
        </div>
      ) : (
        <div>
          <ReportViewer
            //requestHeaders={header}
            style={{ height: "80vh" }}
            parameters={parameters}
            serviceUrl={reportUrl}
            filePath={filePath}
            initialized={initViewer}
            beforeSendRequest={beforeXhrRequestSend}
          />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(TMReportViewer);
