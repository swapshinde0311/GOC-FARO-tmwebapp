import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { CaptainDetails } from "../../UIBase/Details/CaptainDetails";
import { emptyCaptain } from "../../../JS/DefaultEntities";
import { captainValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import { connect } from "react-redux";
import * as KeyCodes from "../../../JS/KeyCodes";
import PropTypes from "prop-types";
import lodash from "lodash";
import { functionGroups, fnCaptain ,fnKPIInformation,fnStaffVisitor} from "../../../JS/FunctionGroups";
import { captainAttributeEntity,staffAttributeEntity,visitorAttributeEntity } from "../../../JS/AttributeEntity";
import * as Constants from "../../../JS/Constants";
import { Modal, Button } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { DataTable } from "@scuf/datatable";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiCaptainDetail, kpiStaffVisitorDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class CaptainDetailsComposite extends Component {
  state = {
    captain: lodash.cloneDeep(emptyCaptain),
    modCaptain: {},
    validationErrors: Utilities.getInitialValidationErrors(
      captainValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    attributeValidationErrors: [],
    modAttributeMetaDataList: [],
    languageOptions: [],
    // terminalCodes: [],
    attributeMetaDataList: [],
    isCheckInCheckOutHistoryShow: false,
    checkInCheckOutHistory: [],
    staffAttributeMetaDataList: [],
    staffAttributeValidationErrors: [],
    visitorAttributeMetaDataList: [],
    visitorAttributeValidationErrors: [],
    locationCode: "",
    swipetime: "",
    modStaffAttributeMetaDataList: [],
    modVisitorAttributeMetaDataList: [],
    captainKPIList:[],
    showAuthenticationLayout: false,
    tempCaptain: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLanguages();
      this.getAttributes(this.props.selectedRow);
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      let CaptainCode = this.state.captain.Code
      if (
        CaptainCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCaptain(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getShareholders() {
    try {
      return Utilities.transferListtoOptions(
        this.props.userDetails.EntityResult.ShareholderList
      );
    } catch (error) {
      console.log("CaptainDetailsComposite:Error occured on getShareholders", error);
    }
  }

  getLanguages() {
    axios(
      RestAPIs.GetLanguageList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let languageOptions = [];
          if (result.EntityResult !== null) {
            Object.keys(result.EntityResult).forEach((key) =>
              languageOptions.push({
                text: result.EntityResult[key],
                value: key,
              })
            );
            this.setState({ languageOptions });
          } else {
            console.log("No languages identified.");
          }
        } else {
          console.log("Error in getLanguages:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Languages:", error);
      });
  }

  getAttributes(captainRow) {
    try {
      if (this.props.userType === Constants.GeneralTMUserType.Captain) {
        axios(
          RestAPIs.GetAttributesMetaData,
          Utilities.getAuthenticationObjectforPost(
            [captainAttributeEntity],
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState(
              {
                attributeMetaDataList: lodash.cloneDeep(result.EntityResult.GeneralTMUser_CAPTAIN),
                attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.GeneralTMUser_CAPTAIN
                ),
              },
              () => this.getCaptain(captainRow)
            );
          } else {
            console.log("Error in getAttributes:");
          }
        });
      } else {
        axios(
          RestAPIs.GetAttributesMetaData,
          Utilities.getAuthenticationObjectforPost(
            [staffAttributeEntity,visitorAttributeEntity],
            this.props.tokenDetails.tokenInfo
          )
        ).then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState(
              {
                staffAttributeMetaDataList: lodash.cloneDeep(result.EntityResult.GeneralTMUser_STAFF),
                staffAttributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.GeneralTMUser_STAFF
                ),
                visitorAttributeMetaDataList: lodash.cloneDeep(result.EntityResult.GeneralTMUser_VISITOR),
                visitorAttributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.GeneralTMUser_VISITOR
                ),
              },
              () => this.getCaptain(captainRow)
            );
          } else {
            console.log("Error in getAttributes:");
          }
        });
      }
      
    } catch (error) {
      console.log("Error while getAttributes:", error);
    }
  }

  createTMUser(modCaptain) {
    let keyCode = [
      {
        key: KeyCodes.captainCode,
        value: modCaptain.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.captainCode,
      KeyCodes: keyCode,
      Entity: modCaptain,
    };

    let notification = {
      messageType: "critical",
      message: (this.props.userType === Constants.GeneralTMUserType.Captain) ? "CaptainInfo_AddUpdateSuccessMsg" :
      (modCaptain.UserType === Constants.CommonEntityType.Staff) ? "Staff_AddUpdateSuccessMsg" : "Visitor_AddUpdateSuccessMsg",
      messageResultDetails: [
        {
          keyFields: (this.props.userType === Constants.GeneralTMUserType.Captain) ? ["CaptainInfo_Code"] : 
          (modCaptain.UserType === Constants.CommonEntityType.Staff) ?["StaffVisitorList_StaffCode"]:["StaffVisitorList_VisitorCode"],
          keyValues: [modCaptain.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.CreateTMUser,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              saveEnabled: 
                Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.add,
                  this.props.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
                ),
                showAuthenticationLayout: false,
            },
            () => this.getCaptain({ Common_Code: modCaptain.Code,StaffVisitor_User_Type:modCaptain.UserType })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              this.props.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in createTMUser:", result.ErrorList);
        }
        this.props.onSaved(this.state.modCaptain, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            this.props.userType === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modCaptain, "add", notification);
      });
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var modAttributeMetaDataList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.attributeMetaDataList
        );
        modAttributeMetaDataList = lodash.cloneDeep(
          this.state.modAttributeMetaDataList
        );
        const attributeValidationErrors = lodash.cloneDeep(
          this.state.attributeValidationErrors
        );
        var modCaptain = lodash.cloneDeep(this.state.modCaptain);

        selectedTerminals.forEach((terminal) => {
          var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modCaptain.Attributes.find(
                  (captainAttribute) => {
                    return captainAttribute.TerminalCode === terminal;
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
        modAttributeMetaDataList = Utilities.attributesConvertoDecimal(
          modAttributeMetaDataList
        );
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
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  terminalSelectionChangeOnStaffAttribute(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var modStaffAttributeMetaDataList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.staffAttributeMetaDataList
        );
        modStaffAttributeMetaDataList = lodash.cloneDeep(
          this.state.modStaffAttributeMetaDataList
        );
        const staffAttributeValidationErrors = lodash.cloneDeep(
          this.state.staffAttributeValidationErrors
        );
        var modCaptain = lodash.cloneDeep(this.state.modCaptain);

        selectedTerminals.forEach((terminal) => {
          var existitem = modStaffAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modCaptain.Attributes.find(
                  (captainAttribute) => {
                    return captainAttribute.TerminalCode === terminal;
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
        modStaffAttributeMetaDataList = [];
        modStaffAttributeMetaDataList = attributesTerminalsList;
        modStaffAttributeMetaDataList = Utilities.attributesConvertoDecimal(
          modStaffAttributeMetaDataList
        );
        staffAttributeValidationErrors.forEach((attributeValidation) => {
          var existTerminal = selectedTerminals.find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });
          if (existTerminal === undefined) {
            Object.keys(attributeValidation.attributeValidationErrors).forEach(
              (key) => (attributeValidation.attributeValidationErrors[key] = "")
            );
          }
        });
        this.setState({ modStaffAttributeMetaDataList, staffAttributeValidationErrors,modVisitorAttributeMetaDataList:[]});
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on terminalSelectionChangeOnStaffAttribute",
        error
      );
    }
    
  }

  terminalSelectionChangeOnVisitorAttribute(selectedTerminals) {
    try {
      if (selectedTerminals !== undefined && selectedTerminals !== null) {
        let attributesTerminalsList = [];
        var attributeMetaDataList = [];
        var modVisitorAttributeMetaDataList = [];
        attributeMetaDataList = lodash.cloneDeep(
          this.state.visitorAttributeMetaDataList
        );
        modVisitorAttributeMetaDataList = lodash.cloneDeep(
          this.state.modVisitorAttributeMetaDataList
        );
        const visitorAttributeValidationErrors = lodash.cloneDeep(
          this.state.visitorAttributeValidationErrors
        );
        var modCaptain = lodash.cloneDeep(this.state.modCaptain);

        selectedTerminals.forEach((terminal) => {
          var existitem = modVisitorAttributeMetaDataList.find((selectedAttribute) => {
            return selectedAttribute.TerminalCode === terminal;
          });

          if (existitem === undefined) {
            attributeMetaDataList.forEach(function (
              attributeMetaData
            ) {
              if (attributeMetaData.TerminalCode === terminal) {
                var Attributevalue = modCaptain.Attributes.find(
                  (captainAttribute) => {
                    return captainAttribute.TerminalCode === terminal;
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
        modVisitorAttributeMetaDataList = [];
        modVisitorAttributeMetaDataList = attributesTerminalsList;
        modVisitorAttributeMetaDataList = Utilities.attributesConvertoDecimal(
          modVisitorAttributeMetaDataList
        );
        visitorAttributeValidationErrors.forEach((attributeValidation) => {
          var existTerminal = selectedTerminals.find((selectedTerminals) => {
            return attributeValidation.TerminalCode === selectedTerminals;
          });
          if (existTerminal === undefined) {
            Object.keys(attributeValidation.attributeValidationErrors).forEach(
              (key) => (attributeValidation.attributeValidationErrors[key] = "")
            );
          }
        });
        this.setState({ modVisitorAttributeMetaDataList, visitorAttributeValidationErrors,modStaffAttributeMetaDataList:[] });
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on terminalSelectionChangeOnVisitorAttribute",
        error
      );
    }
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );

      if (Array.isArray(attributeMetaDataList) && attributeMetaDataList.length > 0){
        this.terminalSelectionChange([
          attributeMetaDataList[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  localNodeStaffAttribute() {
    try {
      var staffAttributeMetaDataList = lodash.cloneDeep(
        this.state.staffAttributeMetaDataList
      );
      if (staffAttributeMetaDataList.length > 0){
        this.terminalSelectionChangeOnStaffAttribute([
          staffAttributeMetaDataList[0].TerminalCode,
        ]);
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on localNodeStaffAttribute",
        error
      );
    }
  }

  localNodeVisitorAttribute() {
    try {
      var visitorAttributeMetaDataList = lodash.cloneDeep(
        this.state.visitorAttributeMetaDataList
      );
      if (visitorAttributeMetaDataList.length > 0){
        this.terminalSelectionChangeOnVisitorAttribute([
          visitorAttributeMetaDataList[0].TerminalCode,
        ]);
    }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on localNodeVisitorAttribute",
        error
      );
    }
  }

  getCaptain(captainRow) {
    emptyCaptain.LanguageCode = this.props.userDetails.EntityResult.UICulture;
    emptyCaptain.ShareholderCode = this.props.selectedShareholder;
    if (this.props.userType === Constants.GeneralTMUserType.Captain) {
      emptyCaptain.UserType = Constants.GeneralTMUserType.Captain;
      emptyCaptain.TerminalCodes =
      this.props.terminalCodes.length === 1
        ? [...this.props.terminalCodes]
        : [];
    }
   

    // var listOptions = lodash.cloneDeep(this.state.listOptions);
    if (captainRow.Common_Code === undefined) {
      this.setState(
        {
          captain: lodash.cloneDeep(emptyCaptain),
          modCaptain: lodash.cloneDeep(emptyCaptain),
          isReadyToRender: true,
          modAttributeMetaDataList: [],
          // listOptions,
          saveEnabled: 
            Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
              this.props.userType  === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
            ),
          locationCode: "",
          swipetime: "",
          modStaffAttributeMetaDataList: [],
          modVisitorAttributeMetaDataList: [],
          captainKPIList:[],
        },
        () => {
          if (this.props.userType === Constants.GeneralTMUserType.Captain) {
            if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
              if (this.props.terminalCodes.length === 1) {
                this.terminalSelectionChange(this.props.terminalCodes);
              } else {
                this.terminalSelectionChange([]);
              }
            } else {
              this.localNodeAttribute();
            }
          }
        }
      );
      return;
    }
    
    var keyCode = [
      {
        key: KeyCodes.generalTMUserCode,
        value: captainRow.Common_Code,
      },
      {
        key: KeyCodes.userType,
        value: (this.props.userType === Constants.GeneralTMUserType.Captain) ?Constants.GeneralTMUserType.Captain :captainRow.StaffVisitor_User_Type,
      },
    ];
    var obj = {
      keyDataCode: KeyCodes.captainCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetGeneralTMUser,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState(
            {
              isReadyToRender: true,
              captain: lodash.cloneDeep(result.EntityResult),
              modCaptain: lodash.cloneDeep(result.EntityResult),
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                this.props.userType  === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
              ),
            },
            () => {
              this.getKPIList(this.props.selectedShareholder,result.EntityResult.CaptainCode)
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                if (this.props.userType === Constants.GeneralTMUserType.Captain) {
                  this.terminalSelectionChange(result.EntityResult.TerminalCodes);
                }
                else if (result.EntityResult.UserType === Constants.CommonEntityType.Staff) {
                  this.terminalSelectionChangeOnStaffAttribute(result.EntityResult.TerminalCodes);
                }
                else if (result.EntityResult.UserType === Constants.CommonEntityType.Visitor) {
                  this.terminalSelectionChangeOnVisitorAttribute(result.EntityResult.TerminalCodes);
                }
               
              } else {
                if (this.props.userType === Constants.GeneralTMUserType.Captain) {
                  this.localNodeAttribute();
                }
                else if (result.EntityResult.UserType === Constants.CommonEntityType.Staff) {
                  this.localNodeStaffAttribute();
                }
                else if (result.EntityResult.UserType === Constants.CommonEntityType.Visitor) {
                  this.localNodeVisitorAttribute();
                }
              }
              if (this.props.userType !== Constants.GeneralTMUserType.Captain) {
                this.getLastCheckInCheckOutInfo(result.EntityResult);
              }
            }
          );

        } else {
          this.setState({
            captain: lodash.cloneDeep(emptyCaptain),
            modCaptain: lodash.cloneDeep(emptyCaptain),
            isReadyToRender: true,
            modAttributeMetaDataList: [],
          });
          console.log("Error in getCaptain:", result.ErrorList);
        }
      })
  }

  saveCaptain = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempCaptain = lodash.cloneDeep(this.state.tempCaptain);

      this.state.captain.Code === ""
        ? this.createTMUser(tempCaptain)
        : this.updateCaptain(tempCaptain);
    } catch (error) {
      console.log("PrimeMoversComposite : Error in savePrimeMover");
    }
  };

  handleSave = () => {
    try {
     // this.setState({ saveEnabled: false });
      let modCaptain = lodash.cloneDeep(this.state.modCaptain);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.modAttributeMetaDataList
      );
      let modStaffAttributeMetaDataList = Utilities.attributesConverttoLocaleString(
        this.state.modStaffAttributeMetaDataList
      );
      let modVisitorAttributeMetaDataList = Utilities.attributesConverttoLocaleString(
        this.state.modVisitorAttributeMetaDataList
      );
      if (this.validateSave(modCaptain, attributeList,modStaffAttributeMetaDataList,modVisitorAttributeMetaDataList)) {
        modCaptain = this.fillAttributeData(modCaptain, attributeList,modStaffAttributeMetaDataList,modVisitorAttributeMetaDataList);
        

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempCaptain = lodash.cloneDeep(modCaptain);
      this.setState({ showAuthenticationLayout, tempCaptain }, () => {
        if (showAuthenticationLayout === false) {
          this.saveCaptain();
        }
    });


      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log("CaptainDetailsComposite:Error occured on handleSave", error);
    }
  };

  fillAttributeData(modCaptain, attributeList,modStaffAttributeMetaDataList,modVisitorAttributeMetaDataList) {
    try {
      attributeList = Utilities.attributesDatatypeConversion(attributeList);
      modStaffAttributeMetaDataList = Utilities.attributesDatatypeConversion(modStaffAttributeMetaDataList);
      modVisitorAttributeMetaDataList = Utilities.attributesDatatypeConversion(modVisitorAttributeMetaDataList);
      if (this.props.userType === Constants.GeneralTMUserType.Captain) {
        modCaptain.Attributes = Utilities.fillAttributeDetails(attributeList);
      }
      else if (modCaptain.UserType === Constants.CommonEntityType.Staff) {
        modCaptain.Attributes = Utilities.fillAttributeDetails(modStaffAttributeMetaDataList);
      }
      else if (modCaptain.UserType === Constants.CommonEntityType.Visitor) {
        modCaptain.Attributes = Utilities.fillAttributeDetails(modVisitorAttributeMetaDataList);
      }
      return modCaptain;
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on fillAttributeData",
        error
      );
    }
  }

  validateSave(modCaptain, attributeList,modStaffAttributeMetaDataList,modVisitorAttributeMetaDataList) {
    const validationErrors = { ...this.state.validationErrors };
    Object.keys(captainValidationDef).forEach(function (key) {
      if (modCaptain[key] !== undefined)
        validationErrors[key] = Utilities.validateField(
          captainValidationDef[key],
          modCaptain[key]
        );
    });
    if (this.props.userType === Constants.GeneralTMUserType.Captain) {
      if (modCaptain.ShareholderCodes === null || modCaptain.ShareholderCodes === "" || modCaptain.ShareholderCodes.length < 1) {
        validationErrors["ShareholderCodes"] = "ShareholderList_SelectShareholder";
      }
    }
    else {
      if (modCaptain.UserType === null || modCaptain.UserType === "") {
        validationErrors["UserType"] = "StaffVisitor_selectUserType";
      }
    }

    if (modCaptain.Active !== this.state.captain.Active) {
      if (modCaptain.Remarks === null || modCaptain.Remarks === "") {
        validationErrors["Remarks"] = "CaptainInfo_RemarksRequired";
      }
    }

    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );
    var staffAttributeValidationErrors = lodash.cloneDeep(
      this.state.staffAttributeValidationErrors
    );
    var visitorAttributeValidationErrors = lodash.cloneDeep(
      this.state.visitorAttributeValidationErrors
    );

    if (this.props.userType === Constants.GeneralTMUserType.Captain) {
      attributeList.forEach((attribute) => {
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
    }
    else if (modCaptain.UserType === Constants.CommonEntityType.Staff) {
      modStaffAttributeMetaDataList.forEach((attribute) => {
        staffAttributeValidationErrors.forEach((attributeValidation) => {
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
    }
    else if (modCaptain.UserType === Constants.CommonEntityType.Visitor) {
      modVisitorAttributeMetaDataList.forEach((attribute) => {
        visitorAttributeValidationErrors.forEach((attributeValidation) => {
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
    }
    this.setState({ validationErrors, attributeValidationErrors,visitorAttributeValidationErrors,staffAttributeValidationErrors });

    var returnValue = true;
    attributeValidationErrors.forEach((x) => {
      if (returnValue) {
        returnValue = Object.values(x.attributeValidationErrors).every(
          function (value) {
            return value === "";
          }
        );
      } else {
        return returnValue;
      }
    });
    visitorAttributeValidationErrors.forEach((x) => {
      if (returnValue) {
        returnValue = Object.values(x.attributeValidationErrors).every(
          function (value) {
            return value === "";
          }
        );
      } else {
        return returnValue;
      }
    });
    staffAttributeValidationErrors.forEach((x) => {
      if (returnValue) {
        returnValue = Object.values(x.attributeValidationErrors).every(
          function (value) {
            return value === "";
          }
        );
      } else {
        return returnValue;
      }
    });

    if (returnValue)
      returnValue = Object.values(validationErrors).every(function (value) {
        return value === "";
      });

    return returnValue;
  }
 

  updateCaptain(modCaptain) {
    let keyCode = [
      {
        key: KeyCodes.captainCode,
        value: modCaptain.Code,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.captainCode,
      KeyCodes: keyCode,
      Entity: modCaptain,
    };

    let notification = {
      messageType: "critical",
      message: (this.props.userType === Constants.GeneralTMUserType.Captain) ? "CaptainInfo_AddUpdateSuccessMsg" :
      (modCaptain.UserType === Constants.CommonEntityType.Staff) ? "Staff_AddUpdateSuccessMsg" : "Visitor_AddUpdateSuccessMsg",
      messageResultDetails: [
        {
          keyFields: (this.props.userType === Constants.GeneralTMUserType.Captain) ? ["CaptainInfo_Code"] : 
          (modCaptain.UserType === Constants.CommonEntityType.Staff) ?["StaffVisitorList_StaffCode"]:["StaffVisitorList_VisitorCode"],
          keyValues: [modCaptain.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateTMUser,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.setState(
            {
              saveEnabled: 
                Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                  this.props.userType  === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
                ) ,
                showAuthenticationLayout: false,
            },
            () => this.getCaptain({ Common_Code: modCaptain.Code,StaffVisitor_User_Type:modCaptain.UserType })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: 
              Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                this.props.userType  === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
              ) ,
              showAuthenticationLayout: false,
          });
          console.log("Error in update Captain:", result.ErrorList);
        }
        this.props.onSaved(this.state.modCaptain, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: 
            Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              this.props.userType  === Constants.GeneralTMUserType.Captain ? fnCaptain : fnStaffVisitor
            ),
            showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modCaptain, "modify", notification);
      });
  }

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const captain = lodash.cloneDeep(this.state.captain);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState(
        {
          modCaptain: { ...captain },
          selectedCompRow: [],
          validationErrors,
          modAttributeMetaDataList: [],
          modStaffAttributeMetaDataList: [],
          modVisitorAttributeMetaDataList:[]
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            if (this.props.userType === Constants.GeneralTMUserType.Captain) {
              this.terminalSelectionChange(captain.TerminalCodes);
            }
            else if (captain.UserType === Constants.CommonEntityType.Staff) {
              this.terminalSelectionChangeOnStaffAttribute(captain.TerminalCodes);
            }
            else if (captain.UserType === Constants.CommonEntityType.Visitor) {
              this.terminalSelectionChangeOnVisitorAttribute(captain.TerminalCodes);
            }
            this.handleResetAttributeValidationError();
          } else {
            if (this.props.userType === Constants.GeneralTMUserType.Captain) {
              this.localNodeAttribute();
            }
            else if (captain.UserType === Constants.CommonEntityType.Staff) {
              this.localNodeStaffAttribute();
            }
            else if (captain.UserType === Constants.CommonEntityType.Visitor) {
              this.localNodeVisitorAttribute();
            }
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      var staffAttributeMetaDataList = lodash.cloneDeep(
        this.state.staffAttributeMetaDataList
      );
      var visitorAttributeMetaDataList = lodash.cloneDeep(
        this.state.visitorAttributeMetaDataList
      );
      this.setState({
        attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(attributeMetaDataList),
        staffAttributeValidationErrors: Utilities.getAttributeInitialValidationErrors(staffAttributeMetaDataList),
        visitorAttributeValidationErrors: Utilities.getAttributeInitialValidationErrors(visitorAttributeMetaDataList),
      });
    } catch (error) {
      console.log(
        "handleAttributeValidationError:Error occured on handleReset",
        error
      );
    }
  }

  handleChange = (propertyName, data) => {
    try {
      const modCaptain = lodash.cloneDeep(this.state.modCaptain);

      modCaptain[propertyName] = data;
      this.setState({ modCaptain });

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      if (captainValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          captainValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }

      if (propertyName === "TerminalCodes") {
        if (this.props.userType === Constants.GeneralTMUserType.Captain) {
          this.terminalSelectionChange(data);
        }
        else if (modCaptain.UserType === Constants.CommonEntityType.Staff) {
          this.terminalSelectionChangeOnStaffAttribute(data);
        }
        else if (modCaptain.UserType === Constants.CommonEntityType.Visitor) {
          this.terminalSelectionChangeOnVisitorAttribute(data);
        }
      }
      else if (propertyName === "UserType") {
        if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
          if (data === Constants.CommonEntityType.Staff) {
            this.terminalSelectionChangeOnStaffAttribute(modCaptain.TerminalCodes);
          }
          else if (data === Constants.CommonEntityType.Visitor) {
            this.terminalSelectionChangeOnVisitorAttribute(modCaptain.TerminalCodes);
          }
        }
        else {
          if (data === Constants.CommonEntityType.Staff) {
            this.localNodeStaffAttribute();
          }
          else if (data === Constants.CommonEntityType.Visitor) {
            this.localNodeVisitorAttribute();
          }
        }
        this.handleResetAttributeValidationError();
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleAllTerminalsChange = (checked) => {
    try {
      var terminalCodes = [...this.props.terminalCodes];
      var modCaptain = lodash.cloneDeep(this.state.modCaptain);
      if (checked) modCaptain.TerminalCodes = [...terminalCodes];
      else modCaptain.TerminalCodes = [];
      this.setState({ modCaptain: modCaptain });
      if (this.props.userType === Constants.GeneralTMUserType.Captain) {
        this.terminalSelectionChange(modCaptain.TerminalCodes);
      }
      else if (modCaptain.UserType !== "" && modCaptain.UserType === Constants.CommonEntityType.Staff) {
        this.terminalSelectionChangeOnStaffAttribute(modCaptain.TerminalCodes);
      }
      else if (modCaptain.UserType !== "" && modCaptain.UserType === Constants.CommonEntityType.Visitor) {
        this.terminalSelectionChangeOnVisitorAttribute(modCaptain.TerminalCodes);
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modCaptain = lodash.cloneDeep(this.state.modCaptain);
      modCaptain.Active = value;
      if (modCaptain.Active !== this.state.captain.Active)
        modCaptain.Remarks = "";
      this.setState({ modCaptain });
    } catch (error) {
      console.log(error);
    }
  };

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
          attributeValidation.attributeValidationErrors[
            attribute.Code
          ] = Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors,modAttributeMetaDataList });
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  handleStaffAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modStaffAttributeMetaDataList = lodash.cloneDeep(
        this.state.modStaffAttributeMetaDataList
      );
      let matchedAttributesList = modStaffAttributeMetaDataList.filter(
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
      const staffAttributeValidationErrors = lodash.cloneDeep(
        this.state.staffAttributeValidationErrors
      );

      staffAttributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[
            attribute.Code
          ] = Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ staffAttributeValidationErrors,modStaffAttributeMetaDataList });
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleStaffAttributeDataChange",
        error
      );
    }
  };

  handleVisitorAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modVisitorAttributeMetaDataList = lodash.cloneDeep(
        this.state.modVisitorAttributeMetaDataList
      );
      let matchedAttributesList = modVisitorAttributeMetaDataList.filter(
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
      const visitorAttributeValidationErrors = lodash.cloneDeep(
        this.state.visitorAttributeValidationErrors
      );

      visitorAttributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[
            attribute.Code
          ] = Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ visitorAttributeValidationErrors,modVisitorAttributeMetaDataList });
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleVisitorAttributeDataChange",
        error
      );
    }
  };
  

  handleImageChange = (event) => {
    try {
      var modCaptain = lodash.cloneDeep(this.state.modCaptain);

      if (
        event.target.files[0].type.includes("image") &&
        event.target.files[0].size <= 500 * 1024
      ) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onloadend = () => {
          modCaptain.GeneralTMUserImage = reader.result.split(";base64,")[1];
          this.setState({ modCaptain });
        };
      } else {
        console.log("wrong type of image");
        event.target.value = null;
        modCaptain.GeneralTMUserImage = null;
        this.setState({ modCaptain });
      }
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleImageChange",
        error
      );
    }
  };

  handleCheckIn = () => {
    try {
      var modCaptain = lodash.cloneDeep(this.state.modCaptain);
      let notification = {
        messageType: "critical",
        message:"StaffVisitor_CheckedInStatus",
        messageResultDetails: [
          {
            keyFields:  (modCaptain.UserType === Constants.CommonEntityType.Staff) ?["StaffVisitorList_StaffCode"]:["StaffVisitorList_VisitorCode"],
            keyValues: [modCaptain.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.StaffVisitorCheckInCheckOut +
        "?StaffVisitorCode=" + modCaptain.Code +
        "&UserType=" + modCaptain.UserType +
        "&IsCheckIn=" + true,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            if (result.EntityResult.SwipeTime !== undefined && result.EntityResult.SwipeTime !== "") {
              var swipetime = new Date(result.EntityResult.SwipeTime).toLocaleDateString() +
              " " +
              new Date(result.EntityResult.SwipeTime).toLocaleTimeString()
            }
            this.setState({locationCode : result.EntityResult.LocationCode,swipetime: swipetime})
          }
          else {
            notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
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
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleCheckIn",
        error
      );
    }
  }

  handleCheckOut = () => {
    try {
      var modCaptain = lodash.cloneDeep(this.state.modCaptain);
      let notification = {
        messageType: "critical",
        message: "StaffVisitor_CheckedOutStatus",
        messageResultDetails: [
          {
            keyFields:  (modCaptain.UserType === Constants.CommonEntityType.Staff) ?["StaffVisitorList_StaffCode"]:["StaffVisitorList_VisitorCode"],
            keyValues: [modCaptain.Code],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.StaffVisitorCheckInCheckOut +
        "?StaffVisitorCode=" + modCaptain.Code +
        "&UserType=" + modCaptain.UserType +
        "&IsCheckIn=" + false,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            if (result.EntityResult.SwipeTime !== undefined && result.EntityResult.SwipeTime !== "") {
              var swipetime = new Date(result.EntityResult.SwipeTime).toLocaleDateString() +
              " " +
              new Date(result.EntityResult.SwipeTime).toLocaleTimeString()
            }
           
            this.setState({locationCode : result.EntityResult.LocationCode,swipetime:swipetime })
          }
          else {
            notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
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
      
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleCheckOut",
        error
      );
    }
  }

  handleCheckInCheckOutHistory = () => {
    try {
      var modCaptain = lodash.cloneDeep(this.state.modCaptain);
      axios(
        RestAPIs.GetAllCheckInCheckOut +
        "?staffVisitorCode=" + modCaptain.Code +
        "&staffVisitorType=" + modCaptain.UserType,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            result.EntityResult.Table.forEach((key) => {
              if (key.SwipeTime !== undefined && key.SwipeTime !== null) {
                key.SwipeTime = new Date(key.SwipeTime).toLocaleDateString() +
              " " +
              new Date(key.SwipeTime).toLocaleTimeString()
              }
            });

            this.setState({ checkInCheckOutHistory: result.EntityResult.Table,isCheckInCheckOutHistoryShow:true});
          } else {
            this.setState({ checkInCheckOutHistory: []});
            console.log("Error in handleCheckInCheckOutHistory:", result.ErrorList);
          }
        })
    } catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on handleCheckInCheckOutHistory",
        error
      );
    }
  }

  checkInCheckOutHistory = () => {
    return (
      <TranslationConsumer>
        {(t) => (
          <Modal open={this.state.isCheckInCheckOutHistoryShow} className="marineModalPrint">
            <Modal.Content>
              <div className="col col-lg-12">
                <h5>{this.state.modCaptain.Code}</h5>
                <div className="col-12 detailsTable">
                  <DataTable
                    data={this.state.checkInCheckOutHistory}
                  >
                     <DataTable.Column
                                initialWidth="20%"
                                className="compColHeight"
                                key="LocationCode"
                                field="LocationCode"
                                header={t("Location_Code")}
                    ></DataTable.Column>
                     <DataTable.Column
                                initialWidth="20%"
                                className="compColHeight"
                                key="PIN"
                                field="PIN"
                                header={t("DriverList_AccessCard")}
                    ></DataTable.Column>
                     <DataTable.Column
                                initialWidth="30%"
                                className="compColHeight"
                                key="SwipeTime"
                                field="SwipeTime"
                                header={t("TemporaryCard_CardSwipeTime")}
                    ></DataTable.Column>
                     <DataTable.Column
                                initialWidth="30%"
                                className="compColHeight"
                                key="LastUpdatedBy"
                                field="LastUpdatedBy"
                                header={t("ViewEAAuditTrail_LastUpdatedBy")}
                    ></DataTable.Column>
                     {Array.isArray(this.state.checkInCheckOutHistory) &&
                                    this.state.checkInCheckOutHistory.length > this.props.userDetails.EntityResult.PageAttibutes
                                    .WebPortalListPageSize ? (
                      <DataTable.Pagination />) : ("")}
                  </DataTable>
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                type="primary"
                content={t("ReportConfiguration_btnClose")}
                onClick={() => {
                  this.setState({ isCheckInCheckOutHistoryShow: false });
                }}
              />
            </Modal.Footer>
          </Modal>
        )}
      </TranslationConsumer>
    );
  };

  getLastCheckInCheckOutInfo(modCaptain) {
    try {
      axios(
        RestAPIs.GetLastCheckInCheckOutInfo +
        "?StaffVisitorCode=" + modCaptain.Code +
        "&UserType=" + modCaptain.UserType,
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            if (result.EntityResult !== null) {
              if (result.EntityResult.SwipeTime !== null && result.EntityResult.SwipeTime !== undefined && result.EntityResult.SwipeTime !== "") {
                var swipetime = new Date(result.EntityResult.SwipeTime).toLocaleDateString() +
                " " +
                new Date(result.EntityResult.SwipeTime).toLocaleTimeString()
              }
              this.setState({locationCode : result.EntityResult.LocationCode,swipetime:swipetime })
            }
          }
        })
    }catch (error) {
      console.log(
        "CaptainDetailsComposite:Error occured on getLastCheckInCheckOutInfo",
        error
      );
    }
  }
  getKPIList(shareholder,captainCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName:
          this.props.userType === Constants.GeneralTMUserType.Captain
            ? kpiCaptainDetail
            : kpiStaffVisitorDetail,
        InputParameters: [ { key: "CaptainCode", value: captainCode }],
      };
      axios(
        RestAPIs.GetKPI,
        Utilities.getAuthenticationObjectforPost(
          objKPIRequestData,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              captainKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ captainKPIList: [] });
            console.log("Error in captain KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Captain KPIList:", error);
        });
    }
  }

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    return this.props.userType === Constants.GeneralTMUserType.Captain? fnCaptain: fnStaffVisitor
   };

  render() {
    const listOptions = {
      shareholders: this.getShareholders(),
      languageOptions: this.state.languageOptions,
      terminalCodes: this.props.terminalCodes,
      locationCode: this.state.locationCode,
      swipetime: this.state.swipetime,
    };
    const popUpContents = [
      {
        fieldName: "CaptainInfo_LastUpdated",
        fieldValue:
          new Date(
            this.state.modCaptain.LastUpdated
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modCaptain.LastUpdated
          ).toLocaleTimeString(),
      },
      {
        fieldName: "CaptainInfo_CreatedTime",
        fieldValue:
          new Date(this.state.modCaptain.Created).toLocaleDateString() +
          " " +
          new Date(this.state.modCaptain.Created).toLocaleTimeString(),
      },
      {
        fieldName: "CaptainInfo_LastActive",
        fieldValue:this.state.modCaptain.LastActive !== undefined &&
          this.state.modCaptain.LastActive !== null
            ?
          new Date(this.state.modCaptain.LastActive).toLocaleDateString() +
          " " +
          new Date(this.state.modCaptain.LastActive).toLocaleTimeString():"",
      },
       {
        fieldName: "CaptainInfo_LastReported",
        fieldValue: this.state.modCaptain.LastReportTime !== undefined &&
          this.state.modCaptain.LastReportTime !== null
            ?
          new Date(this.state.modCaptain.LastReportTime).toLocaleDateString() +
          " " +
          new Date(this.state.modCaptain.LastReportTime).toLocaleTimeString():"",
      },
    ];

    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.captain.Code}
            newEntityName={(this.props.userType === Constants.GeneralTMUserType.Captain) ? "CaptainInfo_NewCaptain":"StaffOrVisitor_NewStaffOrVisitor"}
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.captainKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <CaptainDetails
            captain={this.state.captain}
            modCaptain={this.state.modCaptain}
            listOptions={listOptions}
            validationErrors={this.state.validationErrors}
            onFieldChange={this.handleChange}
            onActiveStatusChange={this.handleActiveStatusChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            // onShareholderChange={this.handleshareholderChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            attributeValidationErrors={this.state.attributeValidationErrors}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            onAttributeDataChange={this.handleAttributeDataChange} 
            userType={this.props.userType}
            onImageChange={this.handleImageChange}
            handleCheckIn={this.handleCheckIn}
            handleCheckOut={this.handleCheckOut}
            handleCheckInCheckOutHistory={this.handleCheckInCheckOutHistory}
            staffAttributeValidationErrors={this.state.staffAttributeValidationErrors}
            modStaffAttributeMetaDataList={this.state.modStaffAttributeMetaDataList}
            onStaffAttributeDataChange={this.handleStaffAttributeDataChange}
            visitorAttributeValidationErrors={this.state.visitorAttributeValidationErrors}
            modVisitorAttributeMetaDataList={this.state.modVisitorAttributeMetaDataList}
            onVisitorAttributeDataChange={this.handleVisitorAttributeDataChange}
          ></CaptainDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsUserActions
            handleBack={this.props.onBack}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            saveEnabled={this.state.saveEnabled}
          ></TMDetailsUserActions>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={
              this.state.captain.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={this.getFunctionGroupName()}
            handleOperation={this.saveCaptain}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
        {this.state.isCheckInCheckOutHistoryShow ? this.checkInCheckOutHistory() : null}
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

export default connect(mapStateToProps)(CaptainDetailsComposite);

CaptainDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  userType:PropTypes.string.isRequired
};