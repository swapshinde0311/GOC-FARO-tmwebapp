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

class TruckReceiptSealDetailsComposite extends Component {
  state = {
    sealCompartments: this.props.sealCompartments,
  };
   

  getCustomtableData(sealCompartments)
  {
    const   custSealInfo=[];
    sealCompartments.forEach((item) => {
      custSealInfo.push({
        SealNo: item.SealNo===null?"":item.SealNo,
        CompartmentSeqNoInVehicle: item.CompartmentSeqNoInVehicle,
        FinishedProductCode:item.FinishedProductCode===null?"":item.FinishedProductCode,
        ReceiptCompartmentStatus:item.ReceiptCompartmentStatus===null?"":item.ReceiptCompartmentStatus,
        UnLoadedQty:item.UnLoadedQuantity===null?"":item.UnLoadedQuantity + " " + item.UnLoadedQuantityUOM ,
      });
    });
    return custSealInfo;
  };

  updateSealCompartments=()=>{
  
    let sealCompartments = lodash.cloneDeep(this.state.sealCompartments);
  
    let notification = {
      messageType: "critical",
      message: "ViewAllReceipt_SealCompUpdate",
      messageResultDetails: [],
    };
  
    sealCompartments.forEach((item) => {
  
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
              item.CompartmentSeqNoInVehicle,
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
          keyFields: ["Receipt_Code"],
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
        key: KeyCodes.receiptCode,
        value: this.props.transactionCode,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.receiptCode,
      KeyCodes: keyCode,
      Entity: this.state.sealCompartments,
    };
    axios(
      RestAPIs.UpdateReceiptSealCompartments,
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
        console.log("Error while update Receipt Seal Info:", error);
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

  handleSealNoInput=(data)=> {
    let cellInfo = data.rowData;
    return (
      <Input
        fluid
        value={cellInfo.SealNo}
        disabled={false}
        onChange={(celldata) => {
          let sealCompartments = lodash.cloneDeep(this.state.sealCompartments);
        
          let index = sealCompartments.findIndex((comp) => {
            return comp.CompartmentSeqNoInVehicle === cellInfo.CompartmentSeqNoInVehicle;
          });

          if (index >= 0)
          {
            sealCompartments[index].SealNo = celldata;
            
          } 

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
                {t("ViewAllReceipt_SealCompartment") +
                  " : " +
                  this.props.transactionCode}
              </h3>
            </div>
            <div className="col-12 detailsTable">
              <DataTable data={this.getCustomtableData(this.state.sealCompartments)}>
                <DataTable.Column
                  className="compColHeight"
                  field={"CompartmentSeqNoInVehicle"}
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
                  field="ReceiptCompartmentStatus"
                  header={t("ViewShipment_Status")}
                  editable={false}
                  
                />
                <DataTable.Column
                  className="compColHeight"
                  field="UnLoadedQty"
                  header={t("ViewReceiptList_LoadedQuantity")}
                  editable={false}
                />
                <DataTable.Column
                  className="compColHeight"
                  field="SealNo"
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

export default connect(mapStateToProps)(TruckReceiptSealDetailsComposite);

TruckReceiptSealDetailsComposite.propTypes = {
  transactionCode: PropTypes.string.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  sealCompartments: PropTypes.object.isRequired,
  handleSealClose: PropTypes.func.isRequired,
};
 




