import React, { Component } from "react";
import { connect } from "react-redux";
import * as Utilities from "../../../JS/Utilities";
import { sealCompValidationDef } from "../../../JS/DetailsTableValidationDef";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import lodash from "lodash";
import axios from "axios";
import * as KeyCodes from "../../../JS/KeyCodes";
import * as RestAPIs from "../../../JS/RestApis";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Button,  Input,  } from "@scuf/common";
import { DataTable } from "@scuf/datatable";

class TruckShipmentSealDetailsComposite extends Component {
  state = {
    sealCompartments: this.props.sealCompartments,
  };
   

  
  updateSealCompartments=()=>{
    let sealCompartments = lodash.cloneDeep(this.state.sealCompartments);
    let sealCompList = [];

    let notification = {
      messageType: "critical",
      message: "ViewAllShipment_SealCompUpdate",
      messageResultDetails: [],
    };
  
    sealCompartments.forEach((item) => {
      sealCompList.push({
        SealNo: item.SealNo,
        CompNo: item.CompNo,
        ShareholderCode: this.props.selectedShareholder,
        ShipmentCode: this.props.transactionCode,
      });

      sealCompValidationDef.forEach((col) => {
        let err = "";
  
        if (col.validator !== undefined) {
          err = Utilities.validateField(
            col.validator,
            item[col.field]
          );
        }
  
        if (err !== "") {
          notification.messageResultDetails.push({
            keyFields: [
              "ShipmentCompDetail_CompSeqInVehicle",
              col.displayName,
            ],
            keyValues: [
              item.CompNo,
              item[col.field],
            ],
            isSuccess: false,
            errorMessage: err,
          });
        }
      });
  
    });
  
   
  if (notification.messageResultDetails.length > 0 ) {
    toast(
      <ErrorBoundary>
        <NotifyEvent notificationMessage={notification}></NotifyEvent>
      </ErrorBoundary>,
      {
        autoClose: notification.messageType === "success" ? 10000 : false,
      }
    );
     return;
  }
  
  
  notification.messageResultDetails.push(
    {
          keyFields: ["ShipmentCompDetail_ShipmentNumber"],
          keyValues: [this.props.transactionCode],
          isSuccess: false,
          errorMessage: "",
        });
      
  
    var keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: this.props.selectedShareholder,
      },
      {
        key: KeyCodes.shipmentCode,
        value: this.props.transactionCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.shipmentCode,
      KeyCodes: keyCode,
      Entity: sealCompList,
    };
    axios(
      RestAPIs.UpdateSealCompartments,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        notification.messageResultDetails[0].errorMessage = result.ErrorList[0];
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      })
      .catch((error) => {
        console.log("Error while update Shipment Seal Info:", error);
      });
  }
  
  isNodeEnterpriseOrWebortal()
  {
    if (this.props.userDetails.EntityResult.IsEnterpriseNode || this.props.userDetails.EntityResult.IsWebPortalUser) {
     return true;
    } else {
      return false;
    }
  };

   handleSealNoInput = (data) => {
    let cellInfo = data.rowData;
    return (
      <Input
        fluid
        value={cellInfo.SealNo}
        disabled={false}
        onChange={(celldata) => {
          let sealCompartments = lodash.cloneDeep(this.state.sealCompartments);

          let index = sealCompartments.findIndex((comp) => {
            return comp.CompNo === cellInfo.CompNo;
          });

          if (index >= 0) sealCompartments[index].SealNo = celldata;

          this.setState({ sealCompartments });
        }}
        reserveSpace={false}
      />
    );
  };

  
  render() {
    return (
      <div>
        <TranslationConsumer>
        {(t) => (
          <Modal
            open={true}
            size="large"
            className="sealCompartmentsPopUp"
          >
            <Modal.Content>
              <div className="col col-lg-12">
                <h3>
                  {t("ViewAllShipment_SealCompartment") +
                    " : " +
                    this.props.transactionCode}
                </h3>
              </div>
              <div className="col-12 detailsTable">
                <DataTable data={this.state.sealCompartments}>
                  <DataTable.Column
                    className="compColHeight"
                    field={"CompNo"}
                    header={t("ViewShipment_CompartmentSeq")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    field="FinishedProductCode"
                    header={t("ViewShipment_FinishedProductCode")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    field="ShipmentCompartmentStatus"
                    header={t("ViewShipment_Status")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    field="LoadedQuantityUOM"
                    header={t("ViewShipmentStatus_LoadedQuantity")}
                    editable={false}
                  />
                  <DataTable.Column
                    className="compColHeight"
                    header={t("SealMaster_SealNo")}
                    renderer={(cellData) => this.handleSealNoInput(cellData)}
                  />
                </DataTable>
              </div>
            </Modal.Content>
            <Modal.Footer>
            <Button
              content={t("MarineEOD_Close")}
              className="cancelButton"
              onClick={this.props.handleSealClose}
            />
            <Button
              type="primary"
              content={t("SealMaster_Save")}
              disabled={this.isNodeEnterpriseOrWebortal()}
              onClick={this.updateSealCompartments}
            />
          </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(TruckShipmentSealDetailsComposite);

TruckShipmentSealDetailsComposite.propTypes = {
  transactionCode: PropTypes.string.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  sealCompartments: PropTypes.object.isRequired,
  handleSealClose: PropTypes.func.isRequired,
};
 




