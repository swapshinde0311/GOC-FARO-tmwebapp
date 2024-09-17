import React, { Component } from "react";
import { DataTable } from "@scuf/datatable";
import { TranslationConsumer } from "@scuf/localization";
import { Button, Modal, Checkbox } from "@scuf/common";
import PropTypes from "prop-types";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestAPIs from "../../../JS/RestApis";
import * as Utilities from "../../../JS/Utilities";
import { bindActionCreators } from "redux";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { connect } from "react-redux";
import lodash from "lodash";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as wjChart from "@grapecity/wijmo.react.chart";
import * as wjcCore from "@grapecity/wijmo";
import { MARINEDISPATCHSTATUSTIME } from "../../../JS/AttributeEntity";

wjcCore.setLicenseKey(Constants.wizmoKey);

class RailReceiptViewAuditTrailDetailsComposite extends Component {
  state = {
    receiptViewAuditTrailData: [],
    modReceiptViewAuditTrailData: [],
    auditTrailAttributeMetaDataList: [],
    Attributes: [],
  };

  getReceiptViewAuditTrail(receiptCode) {
    if (receiptCode === undefined) {
      this.setState({
        receiptViewAuditTrailData: [],
        modReceiptViewAuditTrailData: [],
      });
      return;
    }
    let keyCode = [
      {
        key: KeyCodes.railReceiptCode,
        value: receiptCode,
      },
    ];
    const cobj = {
      ShareHolderCode: this.props.shareholderCode,
      KeyCodes: keyCode,
    };
    let obj = {
      ReceiptCode: receiptCode,
      TmWebApiRequest: cobj,
    };
    axios(
      RestAPIs.GetRailReceiptAuditTrailList,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
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
            receiptViewAuditTrailData: [],
            modReceiptViewAuditTrailData: [],
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
          if (receiptStatus === Constants.Receipt_Status.AUTO_UNLOADED) {
            receiptStatus = Constants.ReceiptStatus.AUTO_LOADED;
          } else if (receiptStatus === Constants.Receipt_Status.CHECKED_IN) {
            receiptStatus = Constants.ReceiptStatus.CHECKED_IN;
          } else if (receiptStatus === Constants.Receipt_Status.CLOSED) {
            receiptStatus = Constants.ReceiptStatus.CLOSED;
          } else if (receiptStatus === Constants.Receipt_Status.INTERRUPTED) {
            receiptStatus = Constants.ReceiptStatus.INTERRUPTED;
          } else if (receiptStatus === Constants.Receipt_Status.UNLOADING) {
            receiptStatus = Constants.ReceiptStatus.UNLOADING;
          } else if (
            receiptStatus === Constants.Receipt_Status.MANUALLY_UNLOADED
          ) {
            receiptStatus = Constants.ReceiptStatus.MANUALLY_UNLOADED;
          } else if (
            receiptStatus === Constants.Receipt_Status.PARTIALLY_UNLOADED
          ) {
            receiptStatus = Constants.ReceiptStatus.PARTIALLY_UNLOADED;
          } else if (receiptStatus === Constants.Receipt_Status.QUEUED) {
            receiptStatus = Constants.ReceiptStatus.QUEUED;
          } else if (receiptStatus === Constants.Receipt_Status.READY) {
            receiptStatus = Constants.ReceiptStatus.READY;
          } else if (receiptStatus === Constants.Receipt_Status.DE_QUEUED) {
            receiptStatus = Constants.ReceiptStatus.DE_QUEUED;
          } else if (receiptStatus === Constants.Receipt_Status.WEIGHED_IN) {
            receiptStatus = Constants.ReceiptStatus.WEIGHED_IN;
          } else if (receiptStatus === Constants.Receipt_Status.WEIGHED_OUT) {
            receiptStatus = Constants.ReceiptStatus.WEIGHED_OUT;
          } else if (receiptStatus === Constants.Receipt_Status.USER_DEFINED) {
            receiptStatus = Constants.ReceiptStatus.USER_DEFINED;
          } else if (receiptStatus === Constants.Receipt_Status.ASSIGNED) {
            receiptStatus = Constants.ReceiptStatus.ASSIGNED;
          } else if (receiptStatus === Constants.Receipt_Status.CANCELLED) {
            receiptStatus = Constants.ReceiptStatus.CANCELLED;
          } else if (receiptStatus === Constants.Receipt_Status.EXPIRED) {
            receiptStatus = Constants.ReceiptStatus.EXPIRED;
          } else if (receiptStatus === Constants.Receipt_Status.REJECTED) {
            receiptStatus = Constants.ReceiptStatus.REJECTED;
          }
          let attributeMetaDataList = lodash.cloneDeep(
            this.state.auditTrailAttributeMetaDataList
          );
          for (let i = 0; i < receiptViewAuditTrailData.length; i++) {
            receiptViewAuditTrailData[i].AttributesforUI =
              this.formReadonlyCompAttributes(
                receiptViewAuditTrailData[i].Attributes,
                attributeMetaDataList
              );
          }
          let Attributes =
            // receiptViewAuditTrailData !== undefined &&
            receiptViewAuditTrailData.length > 0
              ? receiptViewAuditTrailData[0].AttributesforUI
              : [];

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
            modReceiptViewAuditTrailData,
            Attributes,
            receiptViewAuditTrailData,
          });
        }
      })
      .catch((error) => {
        console.log("Error while getting MarineReceiptViewAuditTrail:", error);
      });
  }

  formReadonlyCompAttributes(attributes, attributeMetaDataList) {
    let compAttributes = [];
    if (
      attributeMetaDataList !== null &&
      attributeMetaDataList !== undefined &&
      attributeMetaDataList.length > 0
    ) {
      attributeMetaDataList.forEach((att) => {
        att.attributeMetaDataList.forEach((attribute) => {
          //if (attribute.TerminalCode)
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

  getAttributes() {
    try {
      axios(
        RestAPIs.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [MARINEDISPATCHSTATUSTIME],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              auditTrailAttributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.MARINEDISPATCHSTATUSTIME
              ),
            },
            () => {
              this.getReceiptViewAuditTrail(this.props.selectedRow.Common_Code);
            }
          );
        } else {
          console.log("Error in getAttributes:");
        }
      });
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }
  componentDidMount() {
    try {
      this.getAttributes();
      //this.getReceiptViewAuditTrail(this.props.selectedRow.Common_Code);
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
    } catch (error) {
      console.log(
        "RailReceiptViewAuditTrailDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
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

  printTable() {
    let el = window.document.getElementById("printTable").innerHTML;
    const iframe = window.document.createElement("IFRAME");
    let doc = null;
    window.document.body.appendChild(iframe);
    doc = iframe.contentWindow.document;
    const str1 = el.substring(0, el.indexOf("<table") + 6);
    const str2 = el.substring(el.indexOf("<table") + 6, el.length);
    el = str1 + ' border="1" cellspacing="0"' + str2;
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
  }

  render() {
    const handleStatus = (e) => {
      if (e === 0 && e !== null) {
        return Constants.ReceiptStatus.COMPLETED.toLocaleString();
      }
      if (e === 1 && e !== null) {
        return Constants.ReceiptStatus.EMPTY.toLocaleString();
      }
      if (e === 2 && e !== null) {
        return Constants.ReceiptStatus.FORCE_COMPLETED.toLocaleString();
      }
      if (e === 3 && e !== null) {
        return Constants.ReceiptStatus.INTERRUPTED.toLocaleString();
      }
      if (e === 4 && e !== null) {
        return Constants.ReceiptStatus.OVER_UNLOADED.toLocaleString();
      }
      if (e === 5 && e !== null) {
        return Constants.ReceiptStatus.PART_UNLOADED.toLocaleString();
      }
      if (e === 6 && e !== null) {
        return Constants.ReceiptStatus.UNLOAD_NOTSTARTED.toLocaleString();
      }
      if (e === 7 && e !== null) {
        return Constants.ReceiptStatus.UNLOADING.toLocaleString();
      } else {
        return e;
      }
    };
    const handleAttributeType = (data) => {
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
    };
    const formatter = (engine, label) => {
      label.cls = null;
      engine.fontSize = "7px";
      if (label.val === Constants.ReceiptStatus.AUTO_LOADED) {
        label.text = Constants.Receipt_Status.AUTO_LOADED;
      } else if (label.val === Constants.ReceiptStatus.CHECKED_IN) {
        label.text = Constants.Receipt_Status.CHECKED_IN;
      } else if (label.val === Constants.ReceiptStatus.CLOSED) {
        label.text = Constants.Receipt_Status.CLOSED;
      } else if (label.val === Constants.ReceiptStatus.INTERRUPTED) {
        label.text = Constants.Receipt_Status.INTERRUPTED;
      } else if (label.val === Constants.ReceiptStatus.UNLOADING) {
        label.text = Constants.Receipt_Status.UNLOADING;
      } else if (label.val === Constants.ReceiptStatus.MANUALLY_UNLOADED) {
        label.text = Constants.Receipt_Status.MANUALLY_UNLOADED;
      } else if (label.val === Constants.ReceiptStatus.PARTIALLY_UNLOADED) {
        label.text = Constants.Receipt_Status.PARTIALLY_UNLOADED;
      } else if (label.val === Constants.ReceiptStatus.QUEUED) {
        label.text = Constants.Receipt_Status.QUEUED;
      } else if (label.val === Constants.ReceiptStatus.READY) {
        label.text = Constants.Receipt_Status.READY;
      } else if (label.val === Constants.ReceiptStatus.DE_QUEUED) {
        label.text = Constants.Receipt_Status.DE_QUEUED;
      } else if (label.val === Constants.ReceiptStatus.WEIGHED_IN) {
        label.text = Constants.Receipt_Status.WEIGHED_IN;
      } else if (label.val === Constants.ReceiptStatus.WEIGHED_OUT) {
        label.text = Constants.Receipt_Status.WEIGHED_OUT;
      } else if (label.val === Constants.ReceiptStatus.USER_DEFINED) {
        label.text = Constants.Receipt_Status.USER_DEFINED;
      } else if (label.val === Constants.ReceiptStatus.ASSIGNED) {
        label.text = Constants.Receipt_Status.ASSIGNED;
      } else if (label.val === Constants.ReceiptStatus.CANCELLED) {
        label.text = Constants.Receipt_Status.CANCELLED;
      } else if (label.val === Constants.ReceiptStatus.EXPIRED) {
        label.text = Constants.Receipt_Status.EXPIRED;
      } else if (label.val === Constants.ReceiptStatus.REJECTED) {
        label.text = Constants.Receipt_Status.REJECTED;
      }
      return label;
    };
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <Modal
              onClose={() => this.setState({ openPrint: false })}
              size="large"
              open={this.state.openPrint}
              className="marineModalPrint"
              closeOnDimmerClick={false}
            >
              <Modal.Content>
                <div id="printTable">
                  <div className="ViewAuditTrailDetailsPrint">
                    <b>
                      {t("ViewAuditTrail_ViewAuditTrailForReceipt") +
                        " : " +
                        this.props.selectedRow.Common_Code}
                    </b>
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
                        max={16}
                        min={0}
                        itemFormatter={formatter}
                        axisLine={true}
                      ></wjChart.FlexChartAxis>
                      <wjChart.FlexChartSeries
                        binding="ReceiptStatus"
                        name="ReceiptStatus"
                      ></wjChart.FlexChartSeries>
                    </wjChart.FlexChart>
                  </div>

                  <div className="col-12 detailsTable">
                    <DataTable
                      data={this.state.receiptViewAuditTrailData}
                      scrollable={true}
                      value={""}
                    >
                      <DataTable.Column
                        className="compColHeight"
                        key="ReceiptCode"
                        field="ReceiptCode"
                        header={t("Receipt_Code")}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight"
                        key="ReceiptStatus"
                        field="ReceiptStatus"
                        header={t("ReceiptStatus")}
                        editable={false}
                        renderer={(cellData) =>
                          handleStatus(cellData.rowData.ReceiptStatus)
                        }
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight"
                        key="TrailerCode"
                        field="TrailerCode"
                        header={t("Rail_Wagon_Code")}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight"
                        key="CarrierCompanyCode"
                        field="CarrierCompanyCode"
                        header={t("Carrier_Company_Code")}
                        editable={false}
                        editFieldType="text"
                      ></DataTable.Column>
                      <DataTable.Column
                        className="compColHeight"
                        key="ReceiptCompartmentStatus"
                        field="ReceiptCompartmentStatus"
                        renderer={(cellData) => {
                          return cellData.value === null
                            ? ""
                            : Utilities.getKeyByValue(
                                Constants.ReceiptCompartmentStatus,
                                cellData.value
                              );
                        }}
                        header={t("ReceiptCompartmentStatus")}
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
                        key="UpdatedTime"
                        field="UpdatedTime"
                        renderer={(cellData) => {
                          return new Date(cellData.value).toLocaleString();
                        }}
                        header={t("SAAuditTrial_UpdatedTime")}
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
                      {this.state.Attributes.map((att) => {
                        return (
                          <DataTable.Column
                            className="compColHeight"
                            header={t(att.AttributeName)}
                            editable={false}
                            renderer={handleAttributeType}
                          ></DataTable.Column>
                        );
                      })}
                    </DataTable>
                  </div>
                </div>
              </Modal.Content>
              <Modal.Footer>
                <Button
                  type="primary"
                  size="small"
                  content={t("EOD_Print")}
                  onClick={() => {
                    this.printTable();
                  }}
                />
                <Button
                  type="primary"
                  size="small"
                  content={t("MarineEOD_Close")}
                  onClick={() => {
                    this.setState({ openPrint: false });
                  }}
                />
              </Modal.Footer>
            </Modal>

            <div className="detailsContainer">
              <div className="row">
                <div className="col-12 ">
                  <h3>
                    {t("ViewAuditTrail_ViewAuditTrailForReceipt") +
                      " : " +
                      this.props.selectedRow.Common_Code}
                  </h3>
                </div>
              </div>
              <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable container-fluid">
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
                      max={16}
                      min={0}
                      itemFormatter={formatter}
                      axisLine={true}
                    ></wjChart.FlexChartAxis>
                    <wjChart.FlexChartSeries
                      binding="ReceiptStatus"
                      name="ReceiptStatus"
                    ></wjChart.FlexChartSeries>
                  </wjChart.FlexChart>
                </div>
              </div>
              <div className="row marginRightZero tableScroll">
                <div className="col-12 detailsTable">
                  <DataTable
                    data={this.state.receiptViewAuditTrailData}
                    scrollable={true}
                    value={""}
                  >
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="ReceiptCode"
                      field="ReceiptCode"
                      header={t("Receipt_Code")}
                      editable={false}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="ReceiptStatus"
                      field="ReceiptStatus"
                      header={t("ReceiptStatus")}
                      editable={false}
                      renderer={(cellData) =>
                        handleStatus(cellData.rowData.ReceiptStatus)
                      }
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="TrailerCode"
                      field="TrailerCode"
                      header={t("Rail_Wagon_Code")}
                      editable={false}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="CarrierCompanyCode"
                      field="CarrierCompanyCode"
                      header={t("Carrier_Company_Code")}
                      editable={false}
                      editFieldType="text"
                    ></DataTable.Column>
                    <DataTable.Column
                      className="compColHeight colminWidth"
                      key="ReceiptCompartmentStatus"
                      field="ReceiptCompartmentStatus"
                      renderer={(cellData) => {
                        return cellData.value === null
                          ? ""
                          : Utilities.getKeyByValue(
                              Constants.ReceiptCompartmentStatus,
                              cellData.value
                            );
                      }}
                      header={t("ReceiptCompartmentStatus")}
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
                      key="UpdatedTime"
                      field="UpdatedTime"
                      renderer={(cellData) => {
                        return new Date(cellData.value).toLocaleString();
                      }}
                      header={t("SAAuditTrial_UpdatedTime")}
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
                    {this.state.Attributes.map((att) => {
                      return (
                        <DataTable.Column
                          className="compColHeight colminWidth"
                          header={t(att.AttributeName)}
                          editable={false}
                          renderer={handleAttributeType}
                        ></DataTable.Column>
                      );
                    })}
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
              </div>
            </div>
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

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
)(RailReceiptViewAuditTrailDetailsComposite);

RailReceiptViewAuditTrailDetailsComposite.propTypes = {
  receiptCode: PropTypes.string.isRequired,
  handleBack: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
};
