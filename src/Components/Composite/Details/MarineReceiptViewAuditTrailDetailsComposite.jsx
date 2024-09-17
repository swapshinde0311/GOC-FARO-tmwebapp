import React, { Component } from "react";
import { DataTable } from "@scuf/datatable";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal, Checkbox } from "@scuf/common";
import PropTypes from "prop-types";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestApis from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { bindActionCreators } from "redux";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { connect } from "react-redux";
import lodash from "lodash";
import { emptyMarineReceipt } from "../../../JS/DefaultEntities";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjcCore from "@grapecity/wijmo";
import { MARINERECEIPTSTATUSTIME } from "../../../JS/AttributeEntity";

wjcCore.setLicenseKey(Constants.wizmoKey);

class MarineReceiptViewAuditTrailDetailsComposite extends Component {
  state = {
    receiptViewAuditTrailData: [],
    modReceiptViewAuditTrailData: [],
    openPrint: false,
    auditTrailAttributeMetaDataList: [],
    compartmentDetailsPageSize:
      this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize,
    ViewAuditTrailList: [],
  };

  getReceiptViewAuditTrail(receiptCode) {
    if (receiptCode === undefined) {
      this.setState({
        receiptViewAuditTrailData: [],
        modReceiptViewAuditTrailData: [],
      });
      return;
    }
    axios(
      RestApis.GetReceiptAuditTrailList +
        "?ShareholderCode=" +
        this.props.userDetails.EntityResult.PrimaryShareholder +
        "&MarineReceiptCode=" +
        receiptCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            receiptViewAuditTrailData: lodash.cloneDeep(result.EntityResult),
            modReceiptViewAuditTrailData: lodash.cloneDeep(result.EntityResult),
          });
        } else {
          this.setState({
            receiptViewAuditTrailData: lodash.cloneDeep(emptyMarineReceipt),
            modReceiptViewAuditTrailData: lodash.cloneDeep(emptyMarineReceipt),
          });
        }
        var modReceiptViewAuditTrailData = lodash.cloneDeep(
          this.state.modReceiptViewAuditTrailData
        );
        var receiptViewAuditTrailData = lodash.cloneDeep(
          this.state.receiptViewAuditTrailData
        );
        for (let i = 0; i < modReceiptViewAuditTrailData.length; i++) {
          let receiptStatus = modReceiptViewAuditTrailData[i].ReceiptStatus;
          if (receiptStatus === Constants.ViewReceipt_Status.AUTO_UNLOADED) {
            receiptStatus = Constants.ViewReceiptStatus.AUTO_UNLOADED;
          } else if (receiptStatus === Constants.ViewReceipt_Status.CLOSED) {
            receiptStatus = Constants.ViewReceiptStatus.CLOSED;
          } else if (
            receiptStatus === Constants.ViewReceipt_Status.INTERRUPTED
          ) {
            receiptStatus = Constants.ViewReceiptStatus.INTERRUPTED;
          } else if (receiptStatus === Constants.ViewReceipt_Status.UNLOADING) {
            receiptStatus = Constants.ViewReceiptStatus.UNLOADING;
          } else if (
            receiptStatus === Constants.ViewReceipt_Status.MANUALLY_UNLOADED
          ) {
            receiptStatus = Constants.ViewReceiptStatus.MANUALLY_UNLOADED;
          } else if (
            receiptStatus === Constants.ViewReceipt_Status.PARTIALLY_UNLOADED
          ) {
            receiptStatus = Constants.ViewReceiptStatus.PARTIALLY_UNLOADED;
          } else if (receiptStatus === Constants.ViewReceipt_Status.QUEUED) {
            receiptStatus = Constants.ViewReceiptStatus.QUEUED;
          } else if (receiptStatus === Constants.ViewReceipt_Status.READY) {
            receiptStatus = Constants.ViewReceiptStatus.READY;
          }
          modReceiptViewAuditTrailData[i].ReceiptStatus = receiptStatus;
          modReceiptViewAuditTrailData[i].UpdatedTime =
            new Date(
              modReceiptViewAuditTrailData[i].UpdatedTime
            ).toLocaleDateString() +
            " " +
            new Date(
              modReceiptViewAuditTrailData[i].UpdatedTime
            ).toLocaleTimeString();
          this.setState({
            receiptViewAuditTrailData,
            modReceiptViewAuditTrailData,
          });
        }
        var ViewAuditTrailList = lodash.cloneDeep(
          this.state.receiptViewAuditTrailData
        );

        for (let i = 0; i < ViewAuditTrailList.length; i++) {
          ViewAuditTrailList[i].AttributesforUI =
            this.formReadonlyCompAttributes(
              ViewAuditTrailList[i].Attributes,
              this.state.auditTrailAttributeMetaDataList
            );
        }
        this.setState({
          ViewAuditTrailList: ViewAuditTrailList,
        });
      })
      .catch((error) => {
        console.log("Error while getting MarineReceiptViewAuditTrail:", error);
      });
  }

  formReadonlyCompAttributes(attributes, ViewAuditTrailList) {
    let compAttributes = [];
    if (
      ViewAuditTrailList !== null &&
      ViewAuditTrailList !== undefined &&
      ViewAuditTrailList.length > 0
    ) {
      ViewAuditTrailList.forEach((att) => {
        att.attributeMetaDataList.forEach((attribute) => {
          compAttributes.push({
            AttributeCode: attribute.Code,
            AttributeName: attribute.DisplayName
              ? attribute.DisplayName
              : attribute.Code,
            AttributeValue: attribute.DefaultValue,
            TerminalCode: attribute.TerminalCode,
            IsMandatory: attribute.IsMandatory,
            DataType: attribute.DataType,
            IsReadonly: attribute.IsReadonly,
            MinValue: attribute.MinValue,
            MaxValue: attribute.MaxValue,
            ValidationFormat: attribute.ValidationFormat,
            compSequenceNo: "",
          });
        });
      });
    }
    if (
      attributes !== null &&
      attributes !== undefined &&
      attributes.length > 0
    ) {
      attributes.forEach((att) => {
        compAttributes.forEach((compAtt) => {
          if (compAtt.TerminalCode === att.TerminalCode) {
            att.ListOfAttributeData.forEach((selAtt) => {
              if (compAtt.AttributeCode === selAtt.AttributeCode)
                compAtt.AttributeValue = selAtt.AttributeValue;
            });
          }
        });
      });
    }
    return compAttributes;
  }

  handlePrint = () => {
    try {
      this.setState({ openPrint: true }, () => {});
    } catch (error) {
      console.log(
        "MarineReceiptViewAuditTrailDetailsComposite:Error occured on handlePrint",
        error
      );
    }
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getAttributes();
    } catch (error) {
      console.log(
        "MarineReceiptViewAuditTrailDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes() {
    try {
      axios(
        RestApis.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [MARINERECEIPTSTATUSTIME],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.MARINERECEIPTSTATUSTIME === null ||
            result.EntityResult.MARINERECEIPTSTATUSTIME === undefined
          ) {
            result.EntityResult.MARINERECEIPTSTATUSTIME = [];
          }
          this.setState(
            {
              auditTrailAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.MARINERECEIPTSTATUSTIME
              ),
            },
            () => {
              this.getReceiptViewAuditTrail(this.props.receiptCode);
            }
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  displayTMModalforPrintConfirm() {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal
            onClose={() => this.setState({ openPrint: false })}
            open={this.state.openPrint}
            className="marineModalPrint"
            closeOnDimmerClick={false}
          >
            <Modal.Content>
              <div className="col col-md-8 col-lg-9 col col-xl-9">
                <h3>
                  {t(
                    "ViewMarineReceiptAuditTrail_ViewAuditTrailForMarineReceipt"
                  ) +
                    " : " +
                    this.props.receiptCode}
                </h3>
              </div>
              <div className="col-md-10 container-fluid">
                <wjChart.FlexChart
                  itemsSource={this.state.modReceiptViewAuditTrailData}
                  chartType="Line"
                  bindingX="UpdatedTime"
                  palette={["red"]}
                  style={{ width: "100%", height: "450px" }}
                >
                  <wjChart.FlexChartLegend position="Bottom"></wjChart.FlexChartLegend>
                  <wjChart.FlexChartAxis
                    wjProperty="axisY"
                    majorUnit={1}
                    max={7}
                    min={0}
                    itemFormatter={formatter}
                    axisLine={true}
                  ></wjChart.FlexChartAxis>
                  <wjChart.FlexChartSeries
                    binding="ReceiptStatus"
                    name={t("ReceiptStatus")}
                  ></wjChart.FlexChartSeries>
                </wjChart.FlexChart>
              </div>
              <div className="col-12 detailsTable" id="printTable">
                <DataTable data={this.state.ViewAuditTrailList}>
                  <DataTable.Column
                    className="compColHeight"
                    key="ReceiptStatus"
                    field="ReceiptStatus"
                    header={t("ReceiptStatus")}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="UpdatedTime"
                    field="UpdatedTime"
                    renderer={(cellData) =>
                      formatDate(cellData.rowData.UpdatedTime)
                    }
                    header={t("SAAuditTrial_UpdatedTime")}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="CompartmentSeqNoInVehicle"
                    field="CompartmentSeqNoInVehicle"
                    header={t(
                      "ViewMarineReceiptAuditTrail_ReceiptCompartmentSeq"
                    )}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="ReceiptCompartmentStatus"
                    field="ReceiptCompartmentStatus"
                    renderer={(cellData) =>
                      handleStatus(cellData.rowData.ReceiptCompartmentStatus)
                    }
                    header={t(
                      "ViewMarineReceiptAuditTrail_ReceiptCompartmentStatus"
                    )}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="UserPIN"
                    field="UserPIN"
                    header={t("PIN")}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  <DataTable.Column
                    className="compColHeight"
                    key="OfficerName"
                    field="OfficerName"
                    header={t("ViewAuditTrail_OfficerName")}
                    editable={false}
                    editFieldType="text"
                  ></DataTable.Column>
                  {this.state.ViewAuditTrailList !== undefined &&
                  this.state.ViewAuditTrailList.length > 0
                    ? this.state.ViewAuditTrailList[0].AttributesforUI.map(
                        (att) => {
                          return (
                            <DataTable.Column
                              className="compColHeight"
                              header={t(att.AttributeName)}
                              editable={false}
                              renderer={handleAttributeType}
                            ></DataTable.Column>
                          );
                        }
                      )
                    : []}
                </DataTable>
              </div>
              <Modal.Footer>
                <div className="viewPrint">
                  <Button
                    type="secondary"
                    size="small"
                    content={t("MarineEOD_Close")}
                    onClick={() => {
                      this.setState({ openPrint: false });
                    }}
                  />
                  <Button
                    type="primary"
                    size="small"
                    content={t("EOD_Print")}
                    onClick={() => {
                      let el =
                        window.document.getElementById("printTable").innerHTML;
                      const iframe = window.document.createElement("IFRAME");
                      let doc = null;
                      window.document.body.appendChild(iframe);
                      doc = iframe.contentWindow.document;
                      const str1 = el.substring(0, el.indexOf("<table") + 6);
                      const str2 = el.substring(
                        el.indexOf("<table") + 6,
                        el.length
                      );
                      const str3 =
                        t(
                          "ViewMarineReceiptAuditTrail_ViewAuditTrailForMarineReceipt"
                        ) +
                        " : " +
                        this.props.receiptCode;
                      el = str3 + str1 + ' border="1" cellspacing="0"' + str2;
                      el = el.replace('<tfoot class="p-datatable-tfoot">', "");
                      el = el.replace(
                        '<tr><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td></tr>',
                        ""
                      );
                      doc.write(el);
                      console.info(el);
                      doc.close();
                      iframe.contentWindow.focus();
                      iframe.contentWindow.print();
                      setTimeout(() => {
                        document.body.removeChild(iframe);
                      }, 2000);
                    }}
                  />
                </div>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        )}
      </TranslationConsumer>
    );
  }

  render() {
    return (
      <div>
        <TranslationConsumer>
          {(t) => (
            <div>
              <div className="detailsContainer">
                <div className="row">
                  <div className="col-12">
                    <h3>
                      {t(
                        "ViewMarineReceiptAuditTrail_ViewAuditTrailForMarineReceipt"
                      ) +
                        " : " +
                        this.props.receiptCode}
                    </h3>
                  </div>
                </div>
                <div className="row marginRightZero tableScroll">
                  <div className="col-12 container-fluid">
                    <wjChart.FlexChart
                      itemsSource={this.state.modReceiptViewAuditTrailData}
                      chartType="Line"
                      bindingX="UpdatedTime"
                      palette={["red"]}
                      style={{
                        width: "100%",
                        minWidth: "800px",
                        height: "450px",
                      }}
                    >
                      <wjChart.FlexChartLegend position="Bottom"></wjChart.FlexChartLegend>
                      <wjChart.FlexChartAxis
                        wjProperty="axisY"
                        majorUnit={1}
                        max={7}
                        min={0}
                        itemFormatter={formatter}
                        axisLine={true}
                      ></wjChart.FlexChartAxis>
                      <wjChart.FlexChartSeries
                        binding="ReceiptStatus"
                        name={t("ReceiptStatus")}
                      ></wjChart.FlexChartSeries>
                    </wjChart.FlexChart>
                  </div>
                </div>
                <div className="row marginRightZero tableScroll">
                  <div className="col-12 detailsTable">
                    <DataTable data={this.state.ViewAuditTrailList}>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="ReceiptStatus"
                        field="ReceiptStatus"
                        header={t("ReceiptStatus")}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="UpdatedTime"
                        field="UpdatedTime"
                        renderer={(cellData) =>
                          formatDate(cellData.rowData.UpdatedTime)
                        }
                        header={t("SAAuditTrial_UpdatedTime")}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="CompartmentSeqNoInVehicle"
                        field="CompartmentSeqNoInVehicle"
                        header={t(
                          "ViewMarineReceiptAuditTrail_ReceiptCompartmentSeq"
                        )}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="ReceiptCompartmentStatus"
                        field="ReceiptCompartmentStatus"
                        renderer={(cellData) =>
                          handleStatus(
                            cellData.rowData.ReceiptCompartmentStatus
                          )
                        }
                        header={t(
                          "ViewMarineReceiptAuditTrail_ReceiptCompartmentStatus"
                        )}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="UserPIN"
                        field="UserPIN"
                        header={t("PIN")}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight colminWidth"
                        key="OfficerName"
                        field="OfficerName"
                        header={t("ViewAuditTrail_OfficerName")}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      {this.state.ViewAuditTrailList !== undefined &&
                      this.state.ViewAuditTrailList.length > 0
                        ? this.state.ViewAuditTrailList[0].AttributesforUI.map(
                            (att) => {
                              return (
                                <DataTable.Column
                                  className="compColHeight colminWidth"
                                  header={t(att.AttributeName)}
                                  editable={false}
                                  renderer={handleAttributeType}
                                ></DataTable.Column>
                              );
                            }
                          )
                        : []}
                    </DataTable>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6 col-lg-8">
                    <Button
                      className="backButton"
                      onClick={this.props.handleBack}
                      content={t("Back")}
                    ></Button>
                  </div>
                  {!this.props.userDetails.EntityResult.IsWebPortalUser ? (
                    <div
                      className="col-12 col-sm-6 col-lg-4"
                      style={{ textAlign: "right" }}
                    >
                      <Button
                        className="printButton"
                        onClick={this.handlePrint}
                        content={t("ViewEAAuditTrail_PrintAuditTrail")}
                      ></Button>
                    </div>
                  ) : (
                    []
                  )}
                </div>
              </div>
            </div>
          )}
        </TranslationConsumer>
        {this.displayTMModalforPrintConfirm()}
      </div>
    );
  }
}

const formatDate = (e) => {
  try {
    if (e == null || e === "" || e === undefined) {
      return "";
    }
    return (
      new Date(e).toLocaleDateString() + " " + new Date(e).toLocaleTimeString()
    );
  } catch (error) {
    return "";
  }
};

const formatter = (engine, label) => {
  label.cls = null;
  engine.fontSize = "7px";
  if (label.val === Constants.ViewReceiptStatus.AUTO_UNLOADED) {
    label.text = Constants.ViewReceipt_Status.AUTO_UNLOADED;
  } else if (label.val === Constants.ViewReceiptStatus.CLOSED) {
    label.text = Constants.ViewReceipt_Status.CLOSED;
  } else if (label.val === Constants.ViewReceiptStatus.INTERRUPTED) {
    label.text = Constants.ViewReceipt_Status.INTERRUPTED;
  } else if (label.val === Constants.ViewReceiptStatus.UNLOADING) {
    label.text = Constants.ViewReceipt_Status.UNLOADING;
  } else if (label.val === Constants.ViewReceiptStatus.MANUALLY_UNLOADED) {
    label.text = Constants.ViewReceipt_Status.MANUALLY_UNLOADED;
  } else if (label.val === Constants.ViewReceiptStatus.PARTIALLY_UNLOADED) {
    label.text = Constants.ViewReceipt_Status.PARTIALLY_UNLOADED;
  } else if (label.val === Constants.ViewReceiptStatus.QUEUED) {
    label.text = Constants.ViewReceipt_Status.QUEUED;
  } else if (label.val === Constants.ViewReceiptStatus.READY) {
    label.text = Constants.ViewReceipt_Status.READY;
  }
  return label;
};

const handleStatus = (e) => {
  try {
    if (e === 0 && e !== null) {
      return Constants.ReceiptCompartment_Status.COMPLETED.toLocaleString();
    }
    if (e === 1 && e !== null) {
      return Constants.ReceiptCompartment_Status.EMPTY.toLocaleString();
    }
    if (e === 2 && e !== null) {
      return Constants.ReceiptCompartment_Status.FORCE_COMPLETED.toLocaleString();
    }
    if (e === 3 && e !== null) {
      return Constants.ReceiptCompartment_Status.INTERRUPTED.toLocaleString();
    }
    if (e === 4 && e !== null) {
      return Constants.ReceiptCompartment_Status.OVER_UNLOADED.toLocaleString();
    }
    if (e === 5 && e !== null) {
      return Constants.ReceiptCompartment_Status.PART_UNLOADED.toLocaleString();
    }
    if (e === 6 && e !== null) {
      return Constants.ReceiptCompartment_Status.UNLOAD_NOTSTARTED.toLocaleString();
    }
    if (e === 7 && e !== null) {
      return Constants.ReceiptCompartment_Status.UNLOADING.toLocaleString();
    } else {
      return e;
    }
  } catch (error) {
    return e;
  }
};

const handleAttributeType = (data) => {
  try {
    const attribute = data.rowData.AttributesforUI.filter(
      (att) => att.AttributeName === data.name
    )[0];

    return attribute.DataType.toLowerCase() ===
      Constants.DataType.STRING.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
        Constants.DataType.INT.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
        Constants.DataType.LONG.toLowerCase() ||
      attribute.DataType.toLowerCase() ===
        Constants.DataType.FLOAT.toLowerCase() ? (
      <label>{attribute.AttributeValue}</label>
    ) : attribute.DataType.toLowerCase() ===
      Constants.DataType.BOOL.toLowerCase() ? (
      <Checkbox
        checked={
          attribute.AttributeValue.toString().toLowerCase() === "true"
            ? true
            : false
        }
        disabled={true}
      ></Checkbox>
    ) : (
      <label>{new Date(attribute.AttributeValue).toLocaleDateString()}</label>
    );
  } catch (error) {
    return "";
  }
};

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

const mapReceiptToProps = (receipt) => {
  return {
    userActions: bindActionCreators(getUserDetails, receipt),
  };
};
export default connect(
  mapStateToProps,
  mapReceiptToProps
)(MarineReceiptViewAuditTrailDetailsComposite);

MarineReceiptViewAuditTrailDetailsComposite.propTypes = {
  receiptCode: PropTypes.string.isRequired,
  handleBack: PropTypes.func.isRequired,
};
