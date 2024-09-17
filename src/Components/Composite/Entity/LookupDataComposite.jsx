import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import { LookupDataSummaryComposite } from "../Summary/LookupDataSummaryComposite";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import { Modal, Button, Input, Radio, TextArea, Icon, Pagination } from "@scuf/common";
import NotifyEvent from "../../../JS/NotifyEvent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TranslationConsumer } from "@scuf/localization";
import lodash from "lodash";
import { emptyLookUpData } from "../../../JS/DefaultEntities"
import { lookupDataValidationDef } from "../../../JS/ValidationDef";
import { functionGroups,fnLookUpData} from "../../../JS/FunctionGroups";
import UserAuthenticationLayout from "../Common/UserAuthentication";
// import _ from "lodash";

const pageSize = 10;

class LookupDataComposite extends Component {
  state = {
    isReadyToRender: false,
    data: [],
    expandedRows: [],
    isLookupValue: false,
    LookupValue: {},
    modLookupValue: lodash.cloneDeep(emptyLookUpData),
    validationErrors: Utilities.getInitialValidationErrors(lookupDataValidationDef),
    value: '',
    searchResult: "",
    pageIndex: 1,
    showAuthenticationLayout: false,
  }
  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLookupDataList();
    } catch (error) {
      console.log(
        "Lookupdatacomposite:Error occured on componentDidMount",
        error
      );
    }
  }
  // handleSearchText = (searchResult) => {
  //   console.log("searchResult", searchResult)
  //   lodash.debounce((searchResult) => this.setState({ searchResult }), 1000)
  // };
  getLookupDataList(LookUpValueData) {
    try {
      axios(
        RestAPIs.GetLookupData,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            console.log(result.EntityResult)
            if (
              result.EntityResult !== null &&
              result.EntityResult.LookUpType !== undefined &&
              result.EntityResult.LookUpValue !== undefined &&
              result.EntityResult.LookUpType !== null &&
              result.EntityResult.LookUpValue !== null &&
              Array.isArray(result.EntityResult.LookUpType) &&
              Array.isArray(result.EntityResult.LookUpValue)
            ) {
              let entityList = result.EntityResult.LookUpValue;
              result.EntityResult.LookUpType.forEach((items) => {
                let entityitem = entityList.filter((entity) => {
                  return entity.lookuptypecode === items.Code;
                });
                items["value"] = entityitem;
              });
            }
              this.setState({
                data: result.EntityResult.LookUpType,
                isReadyToRender: true,
              },
                () => {
                if (LookUpValueData !== null && LookUpValueData !== undefined) {
                  let expandedRowIndex = result.EntityResult.LookUpType.findIndex((item) => {
                    return item.Code == LookUpValueData.lookuptypecode
                  })
                  if (expandedRowIndex >= 0)
                    this.toggleExpand(result.EntityResult.LookUpType[expandedRowIndex], false, false)
                }
               }
            );
          } else {
            this.setState({ data: [], isReadyToRender: true });
            console.log("Error in getLookupDataList:", result.ErrorList);
          }
        })
        .catch((error) => {
          this.setState({ data: [], isReadyToRender: true });
          console.log("Error while getting getLookupDataList:", error);
        });
      
    } catch (error) {
      console.log("Error in getLookupDataList ", error);
    }
  }

  updateLookUpData = () => {
    this.handleAuthenticationClose();
    this.setState({ saveEnabled: false });
    let LookUpValueData= this.state.LookupValue;
    try {
      var notification = {
        messageType: "critical",
        message: "LookUpData_updateMsg",
        messageResultDetails: [
          {
            keyFields: "",
            keyValues: "",
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      var obj = {
        Entity: LookUpValueData,
      };
      axios(
        RestAPIs.UpdateLookupData,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState({isReadyToRender:true }
              , () => {
                this.getLookupDataList(LookUpValueData);
              });
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            this.setState({
              saveEnabled: true
            });
            console.log("Error in updateLookupData:", result.ErrorList);
          }
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
          this.setState({
            saveEnabled: true
          });
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        });
      this.setState({
        LookupValue: this.state.LookupValue,
        isReadyToRender:true,
      },
      );
    } catch (error) {
      console.log("Error in updateLookupData:", error)
    }
  }
  handleReset = () => {
    let LookupValue = lodash.cloneDeep(this.state.modLookupValue)
    this.setState({ LookupValue })
  }
  validateSave(LookupValue) {
    try {
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      Object.keys(lookupDataValidationDef).forEach(function (key) {
        validationErrors[key] = Utilities.validateField(
          lookupDataValidationDef[key],
          LookupValue[key]
        );
      });
      let notification = {
        messageType: "critical",
        message: ["LookUpData_updateMsg"],
        messageResultDetails: [],
      };
      this.setState({ validationErrors });
      var returnValue = true;
      if (returnValue)
        returnValue = Object.values(validationErrors).every(function (value) {
          return value === "";
        });
      if (notification.messageResultDetails.length > 0) {
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification}></NotifyEvent>
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
        return false;
      }
      return returnValue;
    } catch (error) {
      console.log("error in validate save", error)
    }
  }

  handleSave = () => {
    try {
    //  this.setState({ saveEnabled: true });
      let LookUpValueData = this.state.LookupValue;
      if (this.validateSave(LookUpValueData)) {
        let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
    
        this.setState({ showAuthenticationLayout }, () => {
          if (showAuthenticationLayout === false) {
            this.updateLookUpData();
          }
      });
        
      }
    } catch (error) {
      console.log(
        "LookupDataComposite:Error occured on handleSave",
        error
      );
    }
  }
  handleChange = (propertyName, data) => {
    try {
      const LookupValue = lodash.cloneDeep(this.state.LookupValue);
      if (propertyName === "value" && data === true)
        LookupValue.value = true;
      LookupValue[propertyName] = data;
      this.setState({ LookupValue });
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (lookupDataValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          lookupDataValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "LookupdataDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };
  toggleExpand = (data, open, isExpanded = false) => {
    console.log("data Composite", data)
    try {
      let expanded = this.state.expandedRows;
      let expandedRowIndex = expanded.findIndex(
        (item) => item.Code === data.Code
      );
      if (open) {
        if (!isExpanded) {
          expanded.splice(expandedRowIndex, 1);
        }
      } else expanded.push(data);
      this.setState({ expandedRows: expanded });
    }
    catch (error) {
      console.log("Error in ToggleExpand", error);
    }
  };
  handleRowClick = (data) => {
    this.setState({ isLookupValue: true, LookupValue: data.rowData})
  }
  handleLookupValueModal = () => {
    let validationErrors = lodash.cloneDeep(this.state.validationErrors)
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isLookupValue} size="mini" style={{width:"40rem",height:"39rem"}}>
            <Modal.Content>
              <div className="col col-lg-12" style={{ textAlign: "right" }}>
                 <div
                  onClick={() => {
                    this.setState({
                      isLookupValue: false,
                    });
                  }}
                      >
                     <Icon root="common" name="close" />
                      </div>
                        </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.LookupValue.lookuptypecode}
                    label={t("LookUpData_Code")}
                    reserveSpace={false}
                    disabled={true}
                  />
                </div>
                <div className="col col-lg-12">
                  <Input
                    fluid
                    value={this.state.LookupValue.name}
                    label={t("LookUpData_Name")}
                    reserveSpace={false}
                    disabled={true}
                  />
                </div>
                
                {this.state.LookupValue.value === "False" || this.state.LookupValue.value === "True" || this.state.LookupValue.value === "TRUE" || this.state.LookupValue.value === "FALSE"  ?
                  <div className="col col-lg-12 lookupdataradiobutton">
                    <span>{t("LookUpData_Value")}</span>
                  <Radio
                    label={t("LookUpData_rdbTrue")}
                    name="RadioGroup"
                      checked={this.state.LookupValue.value === "True" || this.state.LookupValue.value === "TRUE"?true:false}
                      onChange={(data) => this.handleChange("value", "True")}
                  />
                  <Radio
                    label={t("LookUpData_rdbFalse")}
                    name="RadioGroup"
                      checked={this.state.LookupValue.value === "False" || this.state.LookupValue.value === "FALSE"?true:false}
                      onChange={(data) => this.handleChange("value", "False")}
                  />
                  </div>
                  :
                  <div className="col col-lg-12">
                     <Input
                    fluid
                    value={this.state.LookupValue.value}
                    label={t("LookUpData_Value")}
                    reserveSpace={false}
                    indicator="required"
                      onChange={(data) => this.handleChange("value", data)}
                      error={t(validationErrors.value)}
                  />
                  </div>
                  }
                  
                
                <div className="col col-lg-12 " >
                  <TextArea fluid label={t("LookUpData_Description")}
                    disabled={true}
                    value={this.state.LookupValue.description} />
                </div>
                <div className="col col-lg-12 lookupdataradiobutton">
                  <span>{t("LookUpData_ReadOnly")}</span>
                  <Radio
                    label={t("LookUpData_rdbTrue")}
                    name="RadioGroup"
                    checked={this.state.LookupValue.readonly === true}
                    disabled={true}
                  />
                  <Radio
                    label={t("LookUpData_rdbFalse")}
                    name="RadioGroup"
                    checked={this.state.LookupValue.readonly === false}
                    disabled={true}
                  />
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
                <div className="ViewLookupDetailsButton">
                  <div style={{ float: "right" }}>
              <Button
                content={t("LookUpData_btnReset")}
                className="cancelButton"
                onClick={() => this.handleReset()}
                  />
              <Button
                type="primary"
                content={t("LookUpData_btnSave")}
                onClick={() => this.handleSave()}
                    />
                    </div>
              </div>
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };
  handleSearchChange = (lodash.debounce((value) => {
       const searchResult = value;
      this.setState({ searchResult, isReadyToRender: true ,pageIndex:1})
  }, 100))
  buildPaging = (FilteredLookupdata) =>{
    if (
      FilteredLookupdata !== null &&
      FilteredLookupdata !== undefined &&
      FilteredLookupdata.length > pageSize
    ) {
      return (
        <ErrorBoundary>
          <div>
            <Pagination
              totalItems={FilteredLookupdata.length}
              itemsPerPage={pageSize}
              activePage={this.state.pageIndex}
              onPageChange={(page) => {
                this.setState({ pageIndex: page, isReadyToRender: true })
              }}
              
            ></Pagination>
          </div>
        </ErrorBoundary>
      );
    } else return "";
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    let { searchResult, data } = this.state;
    let searchResults = 
  data.filter(values => {
      return values.Code.toLowerCase().includes(searchResult.toLowerCase()) || values.Description.toLowerCase().includes(searchResult.toLowerCase())|| values.value.some(function (subElement) {
        return subElement.name.toLowerCase().includes(searchResult.toLowerCase()) ||
          subElement.description.toLowerCase().includes(searchResult.toLowerCase()) || subElement.value.toLowerCase().includes(searchResult.toLowerCase())
      });
  })
    let LookupdataPagination = [];
    let pageIndex = lodash.cloneDeep(this.state.pageIndex);
    if (pageSize >= searchResults.length) {
      pageIndex = 1;
    }
    let firstIndexInPage = (pageIndex - 1) * pageSize;
    let lastIndexInPage = firstIndexInPage + pageSize;
    if (lastIndexInPage >= searchResults.length) {
      lastIndexInPage = searchResults.length;
    }
    LookupdataPagination = searchResults.slice(
      firstIndexInPage,
      lastIndexInPage
    );
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            breadcrumbItem={this.props.activeItem}
            shrVisible={false}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            deleteVisible={false}
            addVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        {this.state.isReadyToRender ? (
          <ErrorBoundary>
            <LookupDataSummaryComposite
              tableData={LookupdataPagination}
              // pageSize={
              //   this.props.userDetails.EntityResult.PageAttibutes
              //     .WebPortalListPageSize
              // }
              expandedRows={this.state.expandedRows}
              toggleExpand={this.toggleExpand}
              onRowClick={this.handleRowClick}
              validationErrors={this.state.validationErrors}
              onFieldChange={this.FieldChange}
              results={this.state.searchResult}
              value={this.state.value}
              handleSearchChange={this.handleSearchChange}
              resultRenderer={this.resultRenderer}
              LookupValue={this.state.LookupValue}
              pageSize={pageSize}
              pageIndex={this.state.pageIndex}
              buildPaging={this.buildPaging}
              totalItem={searchResults}

            ></LookupDataSummaryComposite>
          </ErrorBoundary>
          
        ) : (
          <>
            <LoadingPage message="Loading"></LoadingPage>
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
        {this.state.isLookupValue ? this.handleLookupValueModal() : null}
        {this.buildPaging(searchResults)}
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.modify}
            functionGroup={fnLookUpData}
            handleOperation={this.updateLookUpData}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}

      </div>
    );
  }
  
}
const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(LookupDataComposite);

LookupDataComposite.propTypes = {
  activeItem: PropTypes.object,
};
