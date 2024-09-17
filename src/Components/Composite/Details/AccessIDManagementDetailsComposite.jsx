import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import ErrorBoundary from "../../ErrorBoundary";
import lodash from "lodash";
import { emptyAccessCard } from "../../../JS/DefaultEntities";
import { AccessIDManagementDetails } from "../../UIBase/Details/AccessIDManagementDetails";
import * as Utilities from "../../../JS/Utilities";
import { accessCardValidationDef } from "../../../JS/ValidationDef";
import {
  fnAccessCard,
  fnResetPin,
  functionGroups,
  fnIssueCard,
  fnActivateCard,
  fnRevokeCard,
  fnKPIInformation
} from "../../../JS/FunctionGroups";
import * as KeyCodes from "../../../JS/KeyCodes";
import axios from "axios";
import { AccessIDManagementSectionDetails } from "../../UIBase/Details/AccessIDManagementSectionDetails";
import * as Constants from "../../../JS/Constants";
import * as RestApis from "../../../JS/RestApis";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import { accessCardAttributeEntity } from "../../../JS/AttributeEntity";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiAccessCardDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class AccessIDManagementDetailsComposite extends Component {
  state = {
    accessCard: lodash.cloneDeep(emptyAccessCard),
    modAccessCard: {},
    validationErrors: Utilities.getInitialValidationErrors(
      accessCardValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: true,
    issueEnabled: false,
    activateEnable: false,
    revokeEnable: false,
    CarrierCompanies: [],
    entityTypeList: [],
    EntityValues: [],
    modelOpen: true,
    CarrierCodeEnable: false,
    passwordEnable: false,
    isTWICEnable: false,
    FASCNId: "",

    attributeMetaDataList: [],
    attributeValidationErrors: [],
    modAttributeMetaDataList: [],
    attribute: [],
    accescardKPIList: [],
    tempAccessCard: {},

    showAccessCardAuthenticationLayout: false,
    showIssueAuthenticationLayout: false,
    showRevokeAuthenticationLayout: false,
    showActivateAuthenticationLayout: false,
    showResetPinAuthenticationLayout: false,
    showChangePasswordAuthenticationLayout: false,

  };

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.accessCard.PIN !== "" &&
        nextProps.selectedRow.AccessCardList_x_IDCode === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getAccessCard(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  initializeTheButtonEnable() {
    Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
    var { issueEnabled } = { ...this.state };
    var { activateEnable } = { ...this.state };
    var { revokeEnable } = { ...this.state };
    issueEnabled = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnIssueCard
    );
    activateEnable = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnActivateCard
    );
    revokeEnable = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnRevokeCard
    );
    this.setState({
      issueEnabled,
      activateEnable,
      revokeEnable,
    });
  }

  componentDidMount() {
    try {
      this.initializeTheButtonEnable();
      this.getAccessCard(this.props.selectedRow);
      this.getCarrierCompanies();
      this.getEntityTypeList();
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getAttributes() {
    try {
      axios(
        RestApis.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [accessCardAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.accessCard === null ||
            result.EntityResult.accessCard === undefined
          ) {
            result.EntityResult.accessCard = [];
          }
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.accessCard
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.accessCard
                ),
            },
            () => {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                if (this.state.attributeMetaDataList.length > 0) {
                  this.terminalSelectionChange([
                    this.state.attributeMetaDataList[0].TerminalCode,
                  ]);
                }
              } else {
                this.localNodeAttribute();
              }
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

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (
        Array.isArray(attributeMetaDataList) &&
        attributeMetaDataList.length > 0
      ) {
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      }
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      let attributesTerminalsList = [];
      var attributeMetaDataList = [];
      var modAttributeMetaDataList = [];

      attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      // modAttributeMetaDataList = lodash.cloneDeep(
      //   this.state.modAttributeMetaDataList
      // );
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );
      var modAccessCard = lodash.cloneDeep(this.state.modAccessCard);
      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });
        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modAccessCard.Attributes.find(
                (attribute) => {
                  return attribute.TerminalCode === terminal;
                }
              );
              if (Attributevalue !== undefined) {
                attributeMetaData.attributeMetaDataList.forEach(function (
                  attributeMetaData
                ) {
                  var valueAttribute = Attributevalue.ListOfAttributeData.find(
                    (x) => {
                      return x.AttributeCode === attributeMetaData.Code;
                    }
                  );
                  if (valueAttribute !== undefined)
                    attributeMetaData.DefaultValue =
                      valueAttribute.AttributeValue;
                });
              }
              attributesTerminalsList.push(attributeMetaData);
            }
          });
        } else {
          attributesTerminalsList.push(existitem);
        }
      });
      modAttributeMetaDataList = [];
      modAttributeMetaDataList = attributesTerminalsList;

      attributeValidationErrors.forEach((attributeValidation) => {
        var existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          Object.keys(attributeValidation.attributeValidationErrors).forEach(
            (key) => (attributeValidation.attributeValidationErrors[key] = "")
          );
        }
      });
      this.setState({ modAttributeMetaDataList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  handleAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modAttributeMetaDataList = lodash.cloneDeep(
        this.state.modAttributeMetaDataList
      );
      let matchedAttributesList = modAttributeMetaDataList.filter(
        (modattribute) => modattribute.TerminalCode === attribute.TerminalCode
      );
      if (
        matchedAttributesList.length > 0 &&
        Array.isArray(matchedAttributesList[0].attributeMetaDataList)
      ) {
        matchedAttributes =
          matchedAttributesList[0].attributeMetaDataList.filter(
            (modattribute) => modattribute.Code === attribute.Code
          );
      }
      if (matchedAttributes.length > 0) {
        matchedAttributes[0].DefaultValue = value;
      }
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors, modAttributeMetaDataList });
      if (
        attribute.DataType === Constants.AttributeTypes.INT ||
        attribute.DataType === Constants.AttributeTypes.LONG ||
        attribute.DataType === Constants.AttributeTypes.FLOAT ||
        attribute.DataType === Constants.AttributeTypes.DOUBLE
      ) {
        value = Utilities.convertStringtoDecimal(value);
      }
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  getAccessCard(selectedRow) {
    emptyAccessCard.ShareholderCode = this.props.selectedShareholder;
    if (selectedRow.AccessCardList_x_IDCode === undefined) {
      this.setState(
        {
          accessCard: lodash.cloneDeep(emptyAccessCard),
          modAccessCard: lodash.cloneDeep(emptyAccessCard),
          isReadyToRender: true,
          accescardKPIList: [],
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnAccessCard
          ),
        },
        () => {
          this.getAttributes();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.accessCardCode,
        value: selectedRow.AccessCardList_x_IDCode,
      },
    ];
    var obj = {
      Shareholdercode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: keyCode,
    };
    axios(
      RestApis.GetAccessCard,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let modAccessCard = lodash.cloneDeep(result.EntityResult);
          let accessCard = lodash.cloneDeep(result.EntityResult);
          if (
            result.EntityResult.FASCN !== null &&
            result.EntityResult.FASCN !== ""
          ) {
            modAccessCard.ISTWICCARD = true;
          }
          if (result.EntityResult.Password !== null) {
            modAccessCard.Password = null;
          }
          this.setState({
            isReadyToRender: true,
            accessCard,
            modAccessCard,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnAccessCard
            ),
          });
          if (
            accessCard.CardStatus === "ACTIVATED" ||
            accessCard.CardStatus === "ISSUED"
          ) {
            this.setState({
              /*  saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnAccessCard
                        ),*/
              passwordEnable: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnResetPin
              ),
            });
          }
          this.initializeTheButtonEnable();
          this.getEntityCodeList();
          this.getTWICEnabled();
          this.getAttributes();
          this.getKPIList(this.props.selectedShareholder, result.EntityResult.PIN)
        } else {
          this.setState({
            accessCard: lodash.cloneDeep(emptyAccessCard),
            modAccessCard: lodash.cloneDeep(emptyAccessCard),
            isReadyToRender: true,
          });
          console.log("Error in GetAccessCard:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting AccessCard:", error, selectedRow);
      });
  }

  getCarrierCompanies() {
    axios(
      RestApis.GetAllCarrierListForRole +
      "?ShareholderCode=" +
      this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var list = result.EntityResult.Table2;
          var CarrierCompanies = [];
          list.forEach((item) => {
            CarrierCompanies.push(item.Code);
          });
          this.setState({
            CarrierCompanies: CarrierCompanies,
          });
        } else {
          console.log("Error in GetCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  getEntityTypeList() {
    axios(
      RestApis.GetEntityTypeList +
      "?ShareholderCode=" +
      this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult != null) {
            var list = result.EntityResult;
            this.setState({
              entityTypeList: list,
            });
          } else {
            console.log("No entityTypeList identified");
          }
        } else {
          console.log("Error in getEntityTypeList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting EntityType List:", error);
      });
  }
  //Get KPI for Access Card
  getKPIList(shareholder, accessCardCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiAccessCardDetail,
        InputParameters: [{ key: "ShareholderCode", value: shareholder }, { key: "AccessCardCode", value: accessCardCode }],
      };
      axios(
        RestApis.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              accescardKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ accescardKPIList: [] });
            console.log("Error in Access Card KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Access Card KPIList:", error);
        });
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAccessCardAuthenticationLayout: false,
      showIssueAuthenticationLayout: false,
      showRevokeAuthenticationLayout: false,
      showActivateAuthenticationLayout: false,
      showResetPinAuthenticationLayout: false,
      showChangePasswordAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    if (this.state.showAccessCardAuthenticationLayout)
      return fnAccessCard
    else if (this.state.showIssueAuthenticationLayout)
      return fnIssueCard
    else if (this.state.showRevokeAuthenticationLayout)
      return fnRevokeCard
    else if (this.state.showActivateAuthenticationLayout)
      return fnActivateCard
    else if (this.state.showResetPinAuthenticationLayout || this.state.showChangePasswordAuthenticationLayout)
      return fnResetPin

  };

  getAddorEditMode() {
    if (this.state.showAccessCardAuthenticationLayout)
      return this.state.accessCard.PIN === "" ? functionGroups.add : functionGroups.modify;
    else
      return functionGroups.modify;
  };


  handleOperation() {

    if (this.state.showAccessCardAuthenticationLayout)
      return this.saveAccessCard
    else if (this.state.showIssueAuthenticationLayout)
      return this.issueAccessCard
    else if (this.state.showRevokeAuthenticationLayout)
      return this.revokeAccessCard
    else if (this.state.showActivateAuthenticationLayout)
      return this.activateAccessCard
    else if (this.state.showResetPinAuthenticationLayout)
      return this.resetPassword
    else if (this.state.showChangePasswordAuthenticationLayout)
      return this.changePassword
  };

  render() {
    const listOptions = {
      cardTypes: ["ELECTRONIC", "VIRTUAL"],
      CarrierCompanies: this.state.CarrierCompanies,
      EntityTypes: this.state.entityTypeList,
      EntityValues: this.state.EntityValues,
    };
    let popUpContents = null;
    try {
      popUpContents = [
        {
          fieldName: "AccessCardInfo_LastUpdated",
          fieldValue:
            new Date(
              this.state.modAccessCard.LastUpdatedTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modAccessCard.LastUpdatedTime
            ).toLocaleTimeString(),
        },
        /*{
                  fieldName: "AccessCardInfo_LastActive",
                  fieldValue:
                      this.state.modAccessCard.LastActiveTime !== undefined &&
                      this.state.modAccessCard.LastActiveTime !== null
                          ? new Date(
                          this.state.modAccessCard.LastActiveTime
                          ).toLocaleDateString() +
                          " " +
                          new Date(
                              this.state.modAccessCard.LastActiveTime
                          ).toLocaleTimeString()
                          : "",
              },*/
        {
          fieldName: "AccessCardInfo_CreatedTime",
          fieldValue:
            new Date(
              this.state.modAccessCard.CreatedTime
            ).toLocaleDateString() +
            " " +
            new Date(this.state.modAccessCard.CreatedTime).toLocaleTimeString(),
        },
      ];
    } catch (error) {
      console.log(error);
    }

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.accessCard.PIN}
            newEntityName="AccessCardInfo_x_NewCard"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.accescardKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <AccessIDManagementDetails
            accessCard={this.state.accessCard}
            modAccessCard={this.state.modAccessCard}
            validationErrors={this.state.validationErrors}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
            onFASCNBlur={this.onFASCNBlur}
            isTWICEnable={this.state.isTWICEnable}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            onAttributeDataChange={this.handleAttributeDataChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
          ></AccessIDManagementDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <AccessIDManagementSectionDetails
            accessCard={this.state.accessCard}
            modAccessCard={this.state.modAccessCard}
            validationErrors={this.state.validationErrors}
            listOptions={listOptions}
            onFieldChange={this.handleChange}
            onChangePasswordClicked={this.handleChangePassword}
            onIssueClicked={this.handleissueAccessCard}
            onActivateClick={this.handleActivateAccessCard}
            onRevokeClick={this.handleRevokeAccessCard}
            onResetPasswordClick={this.handleResetPassword}
            handleBack={this.props.onBack}
            // onSelectFocus={this.onEntitySelectFocus}
            issueEnabled={this.state.issueEnabled}
            activateEnable={this.state.activateEnable}
            revokeEnable={this.state.revokeEnable}
            passwordEnable={this.state.passwordEnable}
            CarrierCodeEnable={this.state.CarrierCodeEnable}
          ></AccessIDManagementSectionDetails>
        </ErrorBoundary>
        {this.state.showAccessCardAuthenticationLayout ||
          this.state.showIssueAuthenticationLayout ||
          this.state.showRevokeAuthenticationLayout ||
          this.state.showActivateAuthenticationLayout ||
          this.state.showResetPinAuthenticationLayout ||
          this.state.showChangePasswordAuthenticationLayout
          ? (
            <UserAuthenticationLayout
              Username={this.props.userDetails.EntityResult.UserName}
              functionName={this.getAddorEditMode()}
              functionGroup={this.getFunctionGroupName()}
              handleOperation={this.handleOperation()}
              handleClose={this.handleAuthenticationClose}
            ></UserAuthenticationLayout>
          ) : null}
      </div>
    ) : (
      <LoadingPage message="Loading"></LoadingPage>
    );
  }

  getEntityCodeList() {
    const { modAccessCard } = this.state;
    if (this.props.selectedShareholder === null) {
      return;
    }
    if (
      modAccessCard.CarrierCode === undefined ||
      modAccessCard.EntityName === undefined
    ) {
      return;
    }
    axios(
      RestApis.GetEntityCodesByCarrierAndEntityType +
      "?ShareholderCode=" +
      this.props.selectedShareholder +
      "&CarrierCode=" +
      modAccessCard.CarrierCode +
      "&EntityType=" +
      modAccessCard.EntityName,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            EntityValues: result.EntityResult,
          });
        } else {
          console.log("Error in onEntitySelectFocus:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Entity Code:", error);
      });
  }

  onEntitySelectFocus = (data) => {
    const { modAccessCard } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    validationErrors["EntityValue"] = "";

    Object.keys(accessCardValidationDef).forEach(function (key) {
      validationErrors[key] = "";
      if (key === "EntityName")
        validationErrors[key] = Utilities.validateField(
          accessCardValidationDef[key],
          modAccessCard[key]
        );
    });
    this.setState({ validationErrors });
    var returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    if (returnValue) {
      axios(
        RestApis.GetEntityCodesByCarrierAndEntityType +
        "?ShareholderCode=" +
        this.props.selectedShareholder +
        "&CarrierCode=" +
        modAccessCard.CarrierCode +
        "&EntityType=" +
        modAccessCard.EntityName,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              EntityValues: result.EntityResult,
            });
          } else {
            console.log("Error in onEntitySelectFocus:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Entity Code:", error);
        });
    }
  };

  handleChangePassword = () => {
    if (this.validatePassword()) {

      let showChangePasswordAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;

      this.setState({ showChangePasswordAuthenticationLayout, }, () => {
        if (showChangePasswordAuthenticationLayout === false) {
          this.changePassword();
        }
      });
    }
  }


  changePassword = () => {
    this.handleAuthenticationClose();
    try {
      let modAccessCard = lodash.cloneDeep(this.state.modAccessCard);
      var keyCode = [
        {
          key: KeyCodes.accessCardCode,
          value: modAccessCard.PIN,
        },
        {
          key: "NewPassword",
          value: modAccessCard.ConfirmPassword,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.accessCardCode,
        KeyCodes: keyCode,
      };
      var notification = {
        messageType: "critical",
        message: "AccessCardInfoDetails_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_x_Title"],
            keyValues: [modAccessCard.PIN],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestApis.ChangePasswordForAccessCard,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            modAccessCard.Password = null;
            modAccessCard.ConfirmPassword = null;
            this.setState({ modAccessCard });
          } else {
            this.setState({ CarrierCodeEnable: false });
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in issueAccessCard:", result.ErrorList);
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification} />
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        });

    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on changePassword",
        error
      );
    }
  };


  handleissueAccessCard = () => {

    this.setState({ issueEnabled: false });

    if (this.validateIssue()) {

      let showIssueAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;

      this.setState({ showIssueAuthenticationLayout, }, () => {
        if (showIssueAuthenticationLayout === false) {
          this.issueAccessCard();
        }
      });
    }
    else {
      this.setState({ issueEnabled: true });
    }
  }


  issueAccessCard = () => {
    this.handleAuthenticationClose();
    try {
      this.initializeTheButtonEnable();
      let modAccessCard = lodash.cloneDeep(this.state.modAccessCard);

      var keyCode = [
        {
          key: KeyCodes.accessCardCode,
          value: modAccessCard.PIN,
        },
        {
          key: "EntityType",
          value: modAccessCard.EntityName,
        },
        {
          key: "EntityCode",
          value: modAccessCard.EntityValue,
        },
        {
          key: KeyCodes.carrierCode,
          value: modAccessCard.CarrierCode
        }
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.accessCardCode,
        KeyCodes: keyCode,
      };
      var notification = {
        messageType: "critical",
        message: "AccessCardInfoDetails_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_x_Title"],
            keyValues: [modAccessCard.PIN],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestApis.IssueAccessCard,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState(
              {
                CarrierCodeEnable: false,
              },
              () =>
                this.getAccessCard({
                  AccessCardList_x_IDCode: modAccessCard.PIN,
                })
            );
          } else {
            this.setState({ CarrierCodeEnable: false });
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in issueAccessCard:", result.ErrorList);
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification} />
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        });
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on issueAccessCard",
        error
      );
    }
  };

  validateIssue() {
    const { modAccessCard } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(accessCardValidationDef).forEach(function (key) {
      if (key !== "CarrierCode" && key !== "FASCN") {
        validationErrors[key] = Utilities.validateField(
          accessCardValidationDef[key],
          modAccessCard[key]
        );
      }
    });
    this.setState({ validationErrors });
    var returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    return returnValue;
  }


  handleActivateAccessCard = () => {

    this.setState({ activateEnable: false });
    if (this.validateActivate()) {

      let showActivateAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;

      this.setState({ showActivateAuthenticationLayout, }, () => {
        if (showActivateAuthenticationLayout === false) {
          this.activateAccessCard();
        }
      });
    }
    else {
      this.setState({ activateEnable: true });
    }
  }

  validateActivate() {
    return true;
  }

  validateRevoke() {
    return true;
  }

  validatePassword() {
    const { modAccessCard } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);

    if (
      modAccessCard.Password.length <= 3 ||
      modAccessCard.Password.length > 20
    ) {
      validationErrors["Password"] = "AccessCardInfo_PwdCriteriaFailed";
    } else {
      validationErrors["Password"] = "";
    }
    if (
      modAccessCard.ConfirmPassword.length <= 3 ||
      modAccessCard.ConfirmPassword.length > 20
    ) {
      validationErrors["ConfirmPassword"] =
        "ERRMSG_ACCESSCARD_PASSWORD_LENGTH_INVALID";
    } else {
      validationErrors["ConfirmPassword"] = "";
    }
    if (modAccessCard.Password !== modAccessCard.ConfirmPassword) {
      validationErrors["ConfirmPassword"] =
        "AccessCardInfo_x_ConfirmPasswordMatch";
    }
    this.setState({ validationErrors });
    var returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    return returnValue;
  }

  activateAccessCard = () => {
    this.handleAuthenticationClose();
    try {
      this.initializeTheButtonEnable();
      let modAccessCard = lodash.cloneDeep(this.state.modAccessCard);
      var keyCode = [
        {
          key: KeyCodes.accessCardCode,
          value: modAccessCard.PIN,
        },
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.accessCardCode,
        KeyCodes: keyCode,
      };
      var notification = {
        messageType: "critical",
        message: "AccessCardInfoDetails_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_x_Title"],
            keyValues: [modAccessCard.PIN],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestApis.ActivateAccessCard,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState({}, () =>
              this.getAccessCard({
                AccessCardList_x_IDCode: modAccessCard.PIN,
              })
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in activateAccessCard:", result.ErrorList);
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        });

    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on activateAccessCard",
        error
      );
    }
  };

  handleRevokeAccessCard = () => {

    this.setState({ revokeEnable: false });
    if (this.validateRevoke()) {

      let showRevokeAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;

      this.setState({ showRevokeAuthenticationLayout, }, () => {
        if (showRevokeAuthenticationLayout === false) {
          this.revokeAccessCard();
        }
      });
    }
    else {
      this.setState({ revokeEnable: true });
    }
  }

  revokeAccessCard = () => {
    this.handleAuthenticationClose();
    try {
      this.initializeTheButtonEnable();
      var validationErrors = lodash.cloneDeep(this.state.validationErrors);
      let modAccessCard = lodash.cloneDeep(this.state.modAccessCard);

      var keyCode = [
        {
          key: KeyCodes.accessCardCode,
          value: modAccessCard.PIN,
        },
        {
          key: "EntityType",
          value: modAccessCard.EntityName,
        },
        {
          key: "EntityCode",
          value: modAccessCard.EntityValue,
        },
        {
          key: KeyCodes.carrierCode,
          value: modAccessCard.CarrierCode
        }
      ];
      var obj = {
        ShareHolderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.accessCardCode,
        KeyCodes: keyCode,
      };
      var notification = {
        messageType: "critical",
        message: "AccessCardInfoDetails_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_x_Title"],
            keyValues: [modAccessCard.PIN],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };

      axios(
        RestApis.RevokeAccessCard,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess
            ? "success"
            : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            modAccessCard.Password = "";
            modAccessCard.ConfirmPassword = "";
            validationErrors["Password"] = "";
            validationErrors["ConfirmPassword"] = "";
            this.setState(
              {
                modAccessCard,
                validationErrors,
                CarrierCodeEnable: false,
                passwordEnable: false,
              },
              () =>
                this.getAccessCard({
                  AccessCardList_x_IDCode: modAccessCard.PIN,
                })
            );
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in revokeAccessCard:", result.ErrorList);
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose:
                notification.messageType === "success" ? 10000 : false,
            }
          );
        });

    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on revokeAccessCard",
        error
      );
    }
  };


  handleResetPassword = () => {

    let showResetPinAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

    this.setState({ showResetPinAuthenticationLayout, }, () => {
      if (showResetPinAuthenticationLayout === false) {
        this.resetPassword();
      }
    });

  }

  resetPassword = () => {
    this.handleAuthenticationClose();
    let modAccessCard = lodash.cloneDeep(this.state.modAccessCard);
    if (modAccessCard.PIN === "" || modAccessCard.PIN === null) {
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.accessCardCode,
        value: modAccessCard.PIN,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: keyCode,
    };
    var notification = {
      messageType: "critical",
      message: "AccessCardInfoDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["AccessCardInfo_x_Title"],
          keyValues: [modAccessCard.PIN],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.ResetPasswordForAccessCard,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in resetPassword:", result.ErrorList);
        }
        toast(
          <ErrorBoundary>
            <NotifyEvent notificationMessage={notification} />
          </ErrorBoundary>,
          {
            autoClose: notification.messageType === "success" ? 10000 : false,
          }
        );
      })
      .catch((error) => {
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
  };

  validateSave() {
    const { modAccessCard, accessCard } = this.state;
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(accessCardValidationDef).forEach(function (key) {
      if (
        key !== "CarrierCode" &&
        key !== "EntityName" &&
        key !== "EntityValue" &&
        key !== "FASCN"
      )
        validationErrors[key] = Utilities.validateField(
          accessCardValidationDef[key],
          modAccessCard[key]
        );
    });

    if (
      modAccessCard.ShareholderCode === null ||
      modAccessCard.ShareholderCode.trim() === ""
    )
      validationErrors["ShareholderCode"] =
        "MarineReceipt_MandatoryShareholder";

    if (modAccessCard.Locked !== accessCard.Locked) {
      if (modAccessCard.Remarks === null || modAccessCard.Remarks === "") {
        validationErrors["Remarks"] = "Please enter the remarks";
      }
    }
    this.setState({ validationErrors });
    /*  var returnValue = Object.values(validationErrors).every(function (value) {
            return value === "" ;
        });*/
    var flag = true;
    Object.keys(validationErrors).forEach(function (key) {
      if (
        key !== "CarrierCode" &&
        key !== "EntityName" &&
        key !== "EntityValue" &&
        key !== "Password" &&
        key !== "ConfirmPassword"
      ) {
        if (validationErrors[key] !== "") {
          flag = false;
        }
      }
    });

    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );
    let modAttributeMetaDataList = lodash.cloneDeep(
      this.state.modAttributeMetaDataList
    );
    modAttributeMetaDataList.forEach((attribute) => {
      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attribute.attributeMetaDataList.forEach((attributeMetaData) => {
            attributeValidation.attributeValidationErrors[
              attributeMetaData.Code
            ] = Utilities.valiateAttributeField(
              attributeMetaData,
              attributeMetaData.DefaultValue
            );
          });
        }
      });
    });
    this.setState({ attributeValidationErrors });
    let returnAttributeValue = true;
    attributeValidationErrors.forEach((x) => {
      returnAttributeValue = Object.values(x.attributeValidationErrors).every(
        function (value) {
          return value === "";
        }
      );
    });
    return flag && returnAttributeValue;
  }

  saveAccessCard = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempAccessCard = lodash.cloneDeep(this.state.tempAccessCard);

      this.state.accessCard.PIN === ""
        ? this.createAccessCard(tempAccessCard)
        : this.updateAccessCard(tempAccessCard);
    } catch (error) {
      console.log("AccessCardComposite : Error in saveAccessCard");
    }
  };

  handleSave = () => {
    try {
      // this.setState({ saveEnabled: false });
      let attributeList = lodash.cloneDeep(this.state.modAttributeMetaDataList);
      let modAccessCard = lodash.cloneDeep(this.state.modAccessCard);
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modAccessCard.Attributes = Utilities.fillAttributeDetails(attributeList);

      if (this.validateSave()) {
        modAccessCard = Utilities.convertDatesToString(
          DateFieldsInEntities.DatesInEntity.AccessCard,
          modAccessCard
        );

        let showAccessCardAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        let tempAccessCard = lodash.cloneDeep(modAccessCard);
        this.setState({ showAccessCardAuthenticationLayout, tempAccessCard }, () => {
          if (showAccessCardAuthenticationLayout === false) {
            this.saveAccessCard();
          }
        });


      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  createAccessCard(modAccessCard) {
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    if (this.state.FASCNId !== "") {
      modAccessCard.PIN = this.state.FASCNId;
      modAccessCard.LogicalPIN = this.state.FASCNId;
      this.setState({ FASCNId: "" });
    }
    if (modAccessCard.ISTWICCARD === true) {
      validationErrors["FASCN"] = Utilities.validateField(
        accessCardValidationDef["FASCN"],
        modAccessCard["FASCN"]
      );
      if (validationErrors["FASCN"] !== "") {
        this.setState({
          validationErrors,
          saveEnabled: true,
        });
        return;
      }
    }
    var keyCode = [
      {
        key: KeyCodes.accessCardCode,
        value: modAccessCard.PIN,
      },
    ];
    modAccessCard.CardStatus = "AVAILABLE";
    modAccessCard.ShareHolderCode = this.props.selectedShareholder;
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: keyCode,
      Entity: modAccessCard,
    };
    var notification = {
      messageType: "critical",
      message: "AccessCardInfoDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["AccessCardInfo_x_Title"],
          keyValues: [modAccessCard.PIN],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.CreateAccessCard,
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
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnAccessCard
              ),
              showAccessCardAuthenticationLayout: false,
            },
            () =>
              this.getAccessCard({ AccessCardList_x_IDCode: modAccessCard.PIN })
          );
          this.props.deleteCallBack({
            AccessCardList_x_IDCode: modAccessCard.PIN,
          });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnAccessCard
            ),
            showAccessCardAuthenticationLayout: false,
          });
          console.log("Error in CreateAccessCard:", result.ErrorList);
        }
        this.props.onSaved(this.state.modAccessCard, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnAccessCard
          ),
          showAccessCardAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modAccessCard, "add", notification);
      });
  }

  updateAccessCard(modAccessCard) {
    let keyCode = [
      {
        key: KeyCodes.accessCardCode,
        value: modAccessCard.PIN,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: keyCode,
      Entity: modAccessCard,
    };
    let notification = {
      messageType: "critical",
      message: "AccessCardInfoDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["AccessCardInfo_x_Title"],
          keyValues: [modAccessCard.PIN],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestApis.UpdateAccessCard,
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
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnAccessCard
              ),
              showAccessCardAuthenticationLayout: false,
            },
            () =>
              this.getAccessCard({ AccessCardList_x_IDCode: modAccessCard.PIN })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnAccessCard
            ),
            showAccessCardAuthenticationLayout: false,
          });
          console.log("Error in UpdateAccessCard:", result.ErrorList);
        }
        this.props.onSaved(this.state.modAccessCard, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modAccessCard, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnAccessCard
          ),
          showAccessCardAuthenticationLayout: false,
        });
      });
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const accessCard = lodash.cloneDeep(this.state.accessCard);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modAccessCard: { ...accessCard },
          validationErrors,
          modAttributeMetaDataList: [],
        },
        () => {
          this.localNodeAttribute();
          this.handleResetAttributeValidationError();
        }
      );
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(attributeMetaDataList),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleResetAttributeValidationError",
        error
      );
    }
  }

  handleChange = (propertyName, data) => {
    try {
      const modAccessCard = lodash.cloneDeep(this.state.modAccessCard);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      modAccessCard[propertyName] = data;
      if (propertyName === "EntityName" && data !== null) {
        modAccessCard["EntityValue"] = "";
        this.setState({ modAccessCard }, () => this.onEntitySelectFocus());
      } else {
        this.setState({ modAccessCard });
      }
      if (propertyName === "CarrierCode" && data !== null) {
        if (modAccessCard.EntityName !== null) {
          this.setState({ modAccessCard }, () => this.onEntitySelectFocus());
        }
      }
      if (propertyName === "CardType" && data === "ELECTRONIC") {
        this.getTWICEnabled();
      }
      if (propertyName === "CardType") {
        modAccessCard.FASCN = "";
        modAccessCard.ISTWICCARD = false;
        validationErrors["FASCN"] = "";
        this.setState({ modAccessCard, validationErrors });
      }
      if (propertyName === "ISTWICCARD" && data === false) {
        validationErrors["FASCN"] = "";
        modAccessCard.FASCN = "";
        this.setState({
          validationErrors,
          modAccessCard,
        });
      }
      if (accessCardValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          accessCardValidationDef[propertyName],
          data
        );
        if (propertyName === "EntityName") {
          if (
            data === Constants.CommonEntityType.TMUser ||
            data === Constants.CommonEntityType.Staff ||
            data === Constants.CommonEntityType.Visitor
          ) {
            modAccessCard.CarrierCode = null;
            this.setState({ modAccessCard, CarrierCodeEnable: true });
            validationErrors["CarrierCode"] = "";
          } else {
            this.setState({ CarrierCodeEnable: false });
          }
        } else {
          if (
            propertyName === "EntityValue" &&
            (modAccessCard.EntityName === Constants.CommonEntityType.TMUser ||
              modAccessCard.EntityName === Constants.CommonEntityType.Staff ||
              modAccessCard.EntityName === Constants.CommonEntityType.Visitor)
          ) {
            this.setState({ CarrierCodeEnable: true });
            validationErrors["CarrierCode"] = "";
          } else {
            this.setState({ CarrierCodeEnable: false });
          }
        }

        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  getTWICEnabled() {
    axios(
      RestApis.GetTWICEnabled,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            isTWICEnable: result.EntityResult === "1",
          });
        } else {
          console.log("Error in getTWICEnabled:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getTWICEnabled:", error);
      });
  }

  validateFASCN() {
    const { modAccessCard } = this.state;
    const validationErrors = lodash.cloneDeep(this.state.validationErrors);
    if (modAccessCard.ISTWICCARD === false) {
      validationErrors["FASCN"] = "";
      this.setState({ validationErrors });
      console.log("validateFASCN over");
      return;
    }
    console.log("validateFASCN do");
    var keyCode = [
      {
        key: "FASCN",
        value: modAccessCard.FASCN,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: keyCode,
    };
    this.setState({
      saveEnabled: false,
    });
    axios(
      RestApis.ValidateFASCN,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        /**  {"ResultDataList":null,"EntityResult":null,"IsSuccess":false,"ErrorList":["Not Found"],"ConfiguredDetails":null} **/
        if (result.IsSuccess === true) {
          var FASCNId = result.EntityResult;
          this.setState({
            FASCNId: FASCNId,
            saveEnabled: true,
          });
        } else {
          console.log("Error while validateFASCN");
          validationErrors["FASCN"] = "AccessCardInfo_InvalidFASCN";
          this.setState({ validationErrors, saveEnabled: true });
        }
      })
      .catch((error) => {
        console.log("Error while validateFASCN:", error);
      });
  }

  onFASCNBlur = () => {
    this.validateFASCN();
  };
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(AccessIDManagementDetailsComposite);

AccessIDManagementDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  deleteCallBack: PropTypes.func.isRequired,
};
