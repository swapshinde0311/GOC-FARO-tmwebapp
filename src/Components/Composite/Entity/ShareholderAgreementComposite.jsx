import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { TranslationConsumer } from "@scuf/localization";
import { ShareholderAgreementSummaryComposite } from "../Summary/ShareholderAgreementSummaryComposite";
import ShareholderAgreementDetailsComposite from "../Details/ShareholderAgreementDetailsComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";
import {
  functionGroups,
  fnShareholderAgreement,
  fnKPIInformation,
} from "../../../JS/FunctionGroups";
import * as Utilities from "../../../JS/Utilities";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "../../../JS/Constants";
import axios from "axios";
import NotifyEvent from "../../../JS/NotifyEvent";
import { Button } from "@scuf/common";
import Error from "../../Error";
class ShareholderAgreementComposite extends Component {
  state = {
    isDetails: false,
    isReadyToRender: false,
    isDetailsModified: false,
    operationsVisibilty: { add: false, shareholder: true },
    selectedRow: {},
    selectedItems: [],
    data: {},
    agreementType: "",
    shareholderVisible: false,
    isComminglingEnable: true,
    selectedShareholder:"",
    popUpContent: [],
  }
  componentName = "ShareholderAgreementComponent";

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.shareholder = false;
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShareholderAgreement
      );
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
        selectedShareholder: this.props.userDetails.EntityResult.PrimaryShareholder,
      });
      this.populatePopupContents();
      this.getLookUpData();
      // this.GetShareholderAgreementsForRole(this.state.selectedShareholder)
    } catch (error) {
      console.log(
        "ShareholderAgrementComposite:Error occured on ComponentDidMount",
        error
      );
    }
  }
  getLookUpData() {
        try {
            axios(
                RestAPIs.GetLookUpData + "?LookUpTypeCode=Commingling",
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    this.setState({
                        isComminglingEnable:
                            result.EntityResult["EnableCommingling"] === "True"
                                ? true
                                : false,
                        shareholderVisible:
                            result.EntityResult["EnableCommingling"] === "True"
                                ? true
                                : false,
                    });
                  if (this.state.isComminglingEnable) {
                    var { operationsVisibilty } = { ...this.state };
                    operationsVisibilty.add = Utilities.isInFunction(
                      this.props.userDetails.EntityResult.FunctionsList,
                      functionGroups.add,
                      fnShareholderAgreement
                    );
                    this.setState({
                      operationsVisibilty,
                    }, () => {
                      this.GetShareholderAgreementsForRole(
                        this.props.userDetails.EntityResult.PrimaryShareholder
                      )
                    }
                    );
                  }
                }
            });
        } catch (error) {
            console.log("ShareholderAgreementComposite:Error occured on getLookUpData", error);
        }
    }
  GetShareholderAgreementsForRole(shareholder) {
    try {
      this.setState({ isReadyToRender: false });
      axios(
        RestAPIs.GetShareholderAgreementsForRole +
        "?ShareholderCode=" +
        shareholder,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            let data = result.EntityResult;
            for (let i = 0; i < data.Table.length; i++) {
              data.Table[i].LastUpdatedTime =
                new Date(
                  data.Table[i].LastUpdatedTime
                ).toLocaleDateString()
            }

            this.setState({ data, isReadyToRender: true });
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in getshareholderagreement:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting shareholderagreement:", error);
        });
    } catch (err) {
      console.log("error while getting shareholderagreement",err)
    }
  }
  
  populatePopupContents() {
    let popUpContent = [...this.state.popUpContent];
      popUpContent.push({
        fieldName: Constants.AgrementType.EXCHANGE_AGREEMENT,
        fieldValue: "ShareholderAgreement_Exchnage",
      });
      popUpContent.push({
        fieldName: Constants.AgrementType.PRODUCT_TRANSFER_AGREEMENT,
        fieldValue: "ShareholderAgreement_Product",
      });
    const operationsVisibilty = { ...this.state.operationsVisibilty };
    operationsVisibilty.add = popUpContent.length ;
    this.setState({
      popUpContent,
      operationsVisibilty,
    });
  }

  handleAdd = (itemName) => {
    try {
      let agreementType = "";
      if (itemName !== null) {
        agreementType = itemName;
      } else {
        agreementType = this.state.popUpContent[0].fieldName;
      }
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.shareholder = false;
      operationsVisibilty.add = false;
      this.setState({
        isDetails: true,
        selectedRow: {},
        operationsVisibilty,
        agreementType: agreementType,
      });
      
    } catch (error) {
      console.log("TruckShipmentComposite:Error occured on handleAdd", error);
    }
  };
  handleShareholderSelectionChange = (shareholder) => {
    let { operationsVisibilty } = { ...this.state };
    try {
      this.setState({
        selectedShareholder: shareholder,
        isReadyToRender: false,
        selectedItems: [],
        operationsVisibilty
      });
      this.GetShareholderAgreementsForRole(shareholder );
    } catch (error) {
      console.log(
        "ShareholderAgrementComposite:Error occured on handleShareholderSelectionChange",
        error
      );
    }
  };
  handleRowClick = (item) => {
    try {
        let operationsVisibilty = { ...this.state.operationsVisibilty };
      operationsVisibilty.add = Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnShareholderAgreement
      );
        operationsVisibilty.shareholder = false;
        this.setState({
          isDetails: true,
          selectedRow: item,
          selectedItems: [item],
          operationsVisibilty,
          agreementType: item.ShareholderAgreement_RequestType
        });
    } catch (error) {
      console.log("TrailerComposite:Error occured on Row click", error);
    }
  };
  onBack = () => {
    var operationsVisibilty = { ...this.state.operationsVisibilty };
    operationsVisibilty.add = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.add,
      fnShareholderAgreement
    );
    operationsVisibilty.delete = false;
    operationsVisibilty.shareholder = true;
    this.setState({
      isDetails: false,
      operationsVisibilty,
      isReadyToRender: false,
    });
    this.GetShareholderAgreementsForRole(this.state.selectedShareholder);
  };
  savedEvent = (data, saveType, notification) => {
    try {
      const operationsVisibilty = { ...this.state.operationsVisibilty };
      if (notification.messageType === "success") {
         operationsVisibilty.add = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnShareholderAgreement
        );
	      operationsVisibilty.delete = Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.remove,
          fnShareholderAgreement
        );
        this.setState({ isDetailsModified: true, operationsVisibilty });
      }
      if (notification.messageType === "success" && saveType === "add") {
        var selectedItems = [
          {
            Common_Code: data.RequestCode,
            Common_Shareholder: data.ShareholderCode,

          },
        ];
        this.setState({ selectedItems });
      }
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log("SealMasterComposite:Error occured on savedEvent", error);
    }
  };
  render() {
    let loadingClass = "globalLoader";
    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            {this.state.isComminglingEnable ? (
              <ErrorBoundary>
                <TMUserActionsComposite
                  operationsVisibilty={this.state.operationsVisibilty}
                  breadcrumbItem={this.props.activeItem}
                  shareholders={this.props.userDetails.EntityResult.ShareholderList}
                  selectedShareholder={this.state.selectedShareholder}
                  onShareholderChange={this.handleShareholderSelectionChange}
                  deleteVisible={false}
                  onAdd={this.handleAdd}
                  popUpContent={
                    this.state.popUpContent.length > 1
                      ? this.state.popUpContent
                      : []
                  }
                  handleBreadCrumbClick={this.props.handleBreadCrumbClick}

                ></TMUserActionsComposite>
              </ErrorBoundary>) : ("")}
        
              {this.state.isDetails === true && this.state.agreementType ? (
                <ErrorBoundary>
                  <ShareholderAgreementDetailsComposite
                    key="ShareholderDetails"
                    selectedRow={this.state.selectedRow}
                    onBack={this.onBack}
                    onSaved={this.savedEvent}
                  agreementType={this.state.agreementType}
                  selectedShareholder={this.state.selectedShareholder}
                  ></ShareholderAgreementDetailsComposite>
                </ErrorBoundary>
              )  : this.state.isReadyToRender ? (
                  <div>
                <ErrorBoundary>
                  <ShareholderAgreementSummaryComposite
                    tableData={this.state.data.Table}
                    columnDetails={this.state.data.Column}
                    pageSize={
                      this.props.userDetails.EntityResult.PageAttibutes
                        .WebPortalListPageSize
                    }
                    exportRequired={true}
                    columnPickerRequired={true}
                    columnGroupingRequired={true}
                    onRowClick={this.handleRowClick}
                    parentComponent={this.componentName}
                  ></ShareholderAgreementSummaryComposite>
                    </ErrorBoundary>
                   
                  </div>
                ) : (
                    <>
                      {this.state.isComminglingEnable ? (
                        <LoadingPage message="Loading"></LoadingPage>
                      ) : (
                          <Error errorMessage="Commingling_Enable"></Error>
                      )}
                    </>
              )}
              <ErrorBoundary>
                <ToastContainer
                  hideProgressBar={true}
                  closeOnClick={false}
                  closeButton={true}
                  newestOnTop={true}
                  position="bottom-right"
                  toastClassName="toast-notification-wrap"
                />
              </ErrorBoundary>
              {/* <ErrorBoundary>
          <div className="detailsContainer">
            <object
              className="tmuiPlaceHolder"
              type="text/html"
              width="100%"
              height="880px"
              //data="http://localhost/TMUI/ShareholderAgreementList.aspx"
              data={"/"+ tmuiInstallType +"/ShareholderAgreementList.aspx"}
            ></object>
          </div>
        </ErrorBoundary> */}
            </div > 
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

export default connect(mapStateToProps)(ShareholderAgreementComposite);

ShareholderAgreementComposite.propTypes = {
  activeItem: PropTypes.object,
};
