import React, { Component } from "react";
import { COAManagementFinishedProductDetails } from "../../UIBase/Details/COAManagementFinishedProductDetails";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import * as Constants from "../../../JS/Constants";
import ReportDetails from "../../UIBase/Details/ReportDetails";

class COAManagementFinishedProductDetailsComposite extends Component {
  state = {
    coaManagementFinishedProduct: {},
    isReadyToRender: false,
    templateParameters: [],
    showReport: false,
  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.coaManagementFinishedProduct.COACode !== "" &&
        nextProps.selectedRow.COACode === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCOAManagementFinishedProduct(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "COAManagementFinishedProductDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getCOAManagementFinishedProduct(this.props.selectedRow);
    } catch (error) {
      console.log(
        "COAManagementFinishedProductDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getCOAManagementFinishedProduct(selectedRow) {
    var keyCode = [
      {
        key: KeyCodes.coaManagementFinishedProductCode,
        value: selectedRow.COACode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.coaManagementFinishedProductCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetCOAManagementFinishedProduct,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let details = result.EntityResult.COAManagementDetailsList;
          var AvailableManagementParameters = [];
          if (Array.isArray(details)) {
            details.forEach((obj) => {
              var tempObj = {
                ParameterName:
                  obj.ParameterName === undefined
                    ? obj.AnalysisParameterName
                    : obj.ParameterName,
                Specification: obj.Specification,
                Method: obj.Method,
                SortIndex: obj.SortIndex,
                Result: obj.Result,
              };
              AvailableManagementParameters.push(tempObj);
            });
          }

          this.setState({
            isReadyToRender: true,
            coaManagementFinishedProduct: lodash.cloneDeep(result.EntityResult),
            templateParameters: AvailableManagementParameters,
          });
        } else {
          this.setState(
            {
              coaManagementFinishedProduct: {},
              isReadyToRender: true,
            },
            () => {}
          );
          console.log(
            "Error in getCOAManagementFinishedProduct:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "Error while getting coaManagementFinishedProduct:",
          error,
          selectedRow
        );
      });
  }

  handleModalBack = () => {
    this.setState({ showReport: false });
  };

  renderModal() {
    let path = null;
    if (this.props.userDetails.EntityResult.IsArchived) {
      path = "TM/" + Constants.TMReportArchive + "/FinishedProductCOAReport";
    } else {
      path = "TM/" + Constants.TMReports + "/FinishedProductCOAReport";
    }
    let paramValues = {
      Culture: this.props.userDetails.EntityResult.UICulture,
      COACode: this.state.coaManagementFinishedProduct.COACode,
    };
    return (
      <ReportDetails
        showReport={this.state.showReport}
        handleBack={this.handleModalBack}
        handleModalClose={this.handleModalBack}
        proxyServerHost={RestAPIs.WebAPIURL}
        reportServiceHost={this.reportServiceURI}
        filePath={path}
        parameters={paramValues}
      />
    );
  }

  handleViewFinishedProductCOAReport = () => {
    if (this.reportServiceURI === undefined) {
      axios(
        RestAPIs.GetReportServiceURI,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        if (response.data.IsSuccess) {
          this.reportServiceURI = response.data.EntityResult;
          //this.reportServiceURI = "http://t1svr:80/";
          this.setState({ showReport: true });
        }
      });
    } else {
      this.setState({ showReport: true });
    }
  };
  render() {
    const listOptions = {
      templateParameters: this.state.templateParameters,
    };
    const popUpContents = [
      {
        fieldName: "COAManagementFinishedProduct_LastUpDt",
        fieldValue:
          new Date(
            this.state.coaManagementFinishedProduct.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.coaManagementFinishedProduct.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "COAManagementFinishedProduct_LastUpdatedBy",
        fieldValue: this.state.coaManagementFinishedProduct.LastUpdatedBy,
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.coaManagementFinishedProduct.COACode}
            newEntityName="COAManagementFinishedProduct_Title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>

        <ErrorBoundary>
          <COAManagementFinishedProductDetails
            coaManagementFinishedProduct={
              this.state.coaManagementFinishedProduct
            }
            genericProps={this.props.genericProps}
            //listOptions={this.state.listOptions}
            listOptions={listOptions}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            pageSize={
              this.props.userDetails.EntityResult.PageAttibutes
                .WebPortalListPageSize
            }
          ></COAManagementFinishedProductDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div className="row userActionPosition">
                <div className="col col-2">
                  <Button
                    className="backButton"
                    onClick={this.props.onBack}
                    content={t("Back")}
                  ></Button>
                </div>
                <div className="col col-10" style={{ textAlign: "right" }}>
                  <Button
                    content={t("COA_ViewFinishedProductCOAReport")}
                    onClick={() => this.handleViewFinishedProductCOAReport()}
                  ></Button>
                </div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
        {this.renderModal()}
      </div>
    ) : (
      <LoadingPage message="Loading"></LoadingPage>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(
  COAManagementFinishedProductDetailsComposite
);

COAManagementFinishedProductDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  activeItem: PropTypes.object,
};
