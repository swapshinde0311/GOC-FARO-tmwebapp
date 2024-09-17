import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptySealMaster } from "../../../JS/DefaultEntities";
import { sealMasterValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { functionGroups, fnSealMaster } from "../../../JS/FunctionGroups";
import { SealMasterDetails } from "../../UIBase/Details/SealMasterDetails";
import { sealMasterAttributeEntity } from "../../../JS/AttributeEntity";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class SealMasterDetailsComposite extends Component {
    state = {
        sealmaster: lodash.cloneDeep(emptySealMaster),
        modSealmaster: {},
        validationErrors: Utilities.getInitialValidationErrors(sealMasterValidationDef),
        isReadyToRender: false,
        saveEnabled: false,
        lookUpData: null,
        isEnable: true,
        attributeMetaDataList: [],
        selectedAttributeList: [],
       attributeValidationErrors: [],
       showAuthenticationLayout: false,
       tempSealmaster: {},
    }

    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.getAttributes(this.props.selectedRow);
            // this.getSealMaster(this.props.selectedRow);
        } catch (error) {
            console.log(
                "SealMasterDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        try {
            if (
                this.state.sealmaster.Code !== "" &&
                nextProps.selectedRow.Common_Code === undefined &&
                this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
            ) {
               // this.getSealMaster(nextProps.selectedRow);
                this.getAttributes(nextProps.selectedRow);
                let validationErrors = { ...this.state.validationErrors };
                Object.keys(validationErrors).forEach((key) => {
                    validationErrors[key] = "";
                });
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "SealMasterDetailsComposite:Error occured on componentWillReceiveProps",
                error
            );
        }
    }
   
    localNodeAttribute() {
        try {
          var attributeMetaDataList = lodash.cloneDeep(
            this.state.attributeMetaDataList
          );
          if (Array.isArray(attributeMetaDataList.SEALMASTER) && attributeMetaDataList.SEALMASTER.length > 0) {
            this.terminalSelectionChange([
              attributeMetaDataList.SEALMASTER[0].TerminalCode,
            ]);
          }
         
        } catch (error) {
          console.log(
            "SealMasterDetailsComposite:Error occured on localNodeAttribute",
            error
          );
        }
      }

      terminalSelectionChange(selectedTerminals) {
        try {
          if (selectedTerminals !== undefined && selectedTerminals !== null) {
            let attributesTerminalsList = [];
            var attributeMetaDataList = [];
            var selectedAttributeList = [];
            attributeMetaDataList = lodash.cloneDeep(
              this.state.attributeMetaDataList
            );
            selectedAttributeList = lodash.cloneDeep(
              this.state.selectedAttributeList
            );
            const attributeValidationErrors = lodash.cloneDeep(
              this.state.attributeValidationErrors
            );
            var modSealmaster = lodash.cloneDeep(this.state.modSealmaster);
    
            selectedTerminals.forEach((terminal) => {
              var existitem = selectedAttributeList.find((selectedAttribute) => {
                return selectedAttribute.TerminalCode === terminal;
              });
    
              if (existitem === undefined) {
                attributeMetaDataList.SEALMASTER.forEach(function (
                  attributeMetaData
                ) {
                  if (attributeMetaData.TerminalCode === terminal) {
                    var Attributevalue = modSealmaster.Attributes.find(
                      (sealMasterAttribute) => {
                        return sealMasterAttribute.TerminalCode === terminal;
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
            selectedAttributeList = [];
            selectedAttributeList = attributesTerminalsList;
            selectedAttributeList = Utilities.attributesConvertoDecimal(
              selectedAttributeList
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
            this.setState({ selectedAttributeList, attributeValidationErrors });
          }
        } catch (error) {
          console.log(
            "Seal Master DetailsComposite:Error occured on terminalSelectionChange",
            error
          );
        }
      }
      
    getAttributes(sealMasterRow) {
        try {
          axios(
            RestAPIs.GetAttributesMetaData,
            Utilities.getAuthenticationObjectforPost(
              [sealMasterAttributeEntity],
              this.props.tokenDetails.tokenInfo
            )
          ).then((response) => {
            var result = response.data;
            if (result.IsSuccess === true) {
              this.setState(
                {
                  attributeMetaDataList: lodash.cloneDeep(result.EntityResult),
                  attributeValidationErrors: Utilities.getAttributeInitialValidationErrors(
                    result.EntityResult.SEALMASTER
                  ),
                },
                () => this.getSealMaster(sealMasterRow)
              );
            } else {
              console.log("Error in getAttributes:");
            }
          });
        } catch (error) {
          console.log("Error while getAttributes:", error);
        }
      }

    getSealMaster(sealMasterRow) {
        
        if (sealMasterRow.Common_Code === undefined) {
            this.setState({
                sealmaster: lodash.cloneDeep(emptySealMaster),
                modSealmaster: lodash.cloneDeep(emptySealMaster),
                isReadyToRender: true,
                selectedAttributeList: [],
                saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.add,
                    fnSealMaster
                ),
            },
            ()=> {
                this.localNodeAttribute();
            }
            );
            return;
        }
        var keyCode = [
            {
                key: KeyCodes.sealMasterCode,
                value: sealMasterRow.Common_Code,
            }
        ];
        var obj = {
            SealMasterCode: sealMasterRow.Common_Code,
            keyDataCode: KeyCodes.sealMasterCode,
            KeyCodes: keyCode,
        };
        axios(
            RestAPIs.GetSealMaster,
            Utilities.getAuthenticationObjectforPost(
                obj,
                this.props.tokenDetails.tokenInfo
            )
        ).then((response) => {
            var result = response.data;
            if (result.IsSuccess === true) {
                result.EntityResult.Code = result.EntityResult.Code.toString();
                this.setState(
                    {
                        isReadyToRender: true,
                        sealmaster: lodash.cloneDeep(result.EntityResult),
                        modSealmaster: lodash.cloneDeep(result.EntityResult),
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnSealMaster
                        ),
                    },()=> {
                        this.localNodeAttribute();
                    }
                );
            } else {
                this.setState({
                    sealmaster: lodash.cloneDeep(emptySealMaster),
                    modSealmaster: lodash.cloneDeep(emptySealMaster),
                    isReadyToRender: true,
                });
                console.log("Error in getSealMaster:", result.ErrorList);
            }
        })
            .catch((error) => {
                console.log("Error while getSealMaster:", error, sealMasterRow);
            });
    }

    handleChange = (propertyName, data) => {
        try {
            const modSealmaster = lodash.cloneDeep(this.state.modSealmaster);
            modSealmaster[propertyName] = data;
            this.setState({ modSealmaster });

            const validationErrors = lodash.cloneDeep(this.state.validationErrors);
            if (sealMasterValidationDef[propertyName] !== undefined) {
                validationErrors[propertyName] = Utilities.validateField(
                    sealMasterValidationDef[propertyName],
                    data
                );
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "SealMasterDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };

    handleReset = () => {
        try {
            const { validationErrors } = { ...this.state };
            const sealmaster = lodash.cloneDeep(this.state.sealmaster);
            Object.keys(validationErrors).forEach(function (key) {
                validationErrors[key] = "";
            });
            this.setState({
                modSealmaster: { ...sealmaster },
                selectedCompRow: [],
                validationErrors,
            });
        } catch (error) {
            console.log("SealMasterDetailsComposite:Error occured on handleReset", error);
        }
    };
  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  saveSealMaster = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempSealmaster = lodash.cloneDeep(this.state.tempSealmaster);
      let attributeList = Utilities.attributesConverttoLocaleString(
        this.state.selectedAttributeList
      );
      tempSealmaster = this.convertStringtoDecimal(
        tempSealmaster,
        attributeList
      )
      this.state.sealmaster.Code === ""
        ? this.CreateSealMaster(tempSealmaster)
        : this.updateSealMaster(tempSealmaster);
    }
      catch (error) {
      console.log("SealMasterDetailsComposite : Error in saveSealMaster");
      }
}
    handleSave = () => {
        try {
            let modSealmaster = this.fillDetails();
            let attributeList = Utilities.attributesConverttoLocaleString(
                this.state.selectedAttributeList
              );
            // this.setState({ saveEnabled: false });
            if (this.validateSave(modSealmaster,attributeList)) {
              let showAuthenticationLayout =
                this.props.userDetails.EntityResult.IsWebPortalUser !== true
                  ? true
                  : false;
              let tempSealmaster = lodash.cloneDeep(modSealmaster);
              this.setState({ showAuthenticationLayout, tempSealmaster }, () => {
                if (showAuthenticationLayout === false) {
                  this.saveSealMaster();
                }
              });
            } else this.setState({ saveEnabled: true });
        }
        catch (error) {
            console.log("SealMasterDetailsComposite:Error occured on handleSave", error);
        }
    };

    fillAttributeDetails(modSealmaster, attributeList) {
        try {
          attributeList = Utilities.attributesDatatypeConversion(attributeList);
    
          modSealmaster.Attributes = [];
          attributeList.forEach((comp) => {
            let attribute = {
              ListOfAttributeData: [],
            };
            attribute.TerminalCode = comp.TerminalCode;
            comp.attributeMetaDataList.forEach((det) => {
              attribute.ListOfAttributeData.push({
                AttributeCode: det.Code,
                AttributeValue: det.DefaultValue,
              });
            });
            modSealmaster.Attributes.push(attribute);
          });
          this.setState({ modSealmaster });
          return modSealmaster;
        } catch (error) {
          console.log(
            "SealMasterDetailsComposite:Error occured on fillAttributeDetails",
            error
          );
        }
      }

    fillDetails() {
        try {
            let modSealmaster = lodash.cloneDeep(this.state.modSealmaster);
            this.setState({ modSealmaster });
            return modSealmaster;

        } catch (error) {
            console.log("SealMasterDetailsComposite:Error occured on fillAttributeDetails", error);
        }
    }

    validateSave(modSealmaster,attributeList) {
        var validationErrors = lodash.cloneDeep(this.state.validationErrors);
        Object.keys(sealMasterValidationDef).forEach(function (key) {
            validationErrors[key] = Utilities.validateField(
                sealMasterValidationDef[key],
                modSealmaster[key]
            );
        });

        var attributeValidationErrors = lodash.cloneDeep(
            this.state.attributeValidationErrors
          );
          
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
      
          this.setState({ validationErrors, attributeValidationErrors });

       
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

        if (modSealmaster.StartSealNo !== "" && modSealmaster.StartSealNo !== null && modSealmaster.EndSealNo !== "" && modSealmaster.EndSealNo !== null) {
            if (parseInt(modSealmaster.StartSealNo) >= parseInt(modSealmaster.EndSealNo)) {
                validationErrors["StartSealNo"] = "SealMaster_Start_End_SealError";
            }
        }
        if (modSealmaster.StartSealNo !== "" && modSealmaster.StartSealNo !== null && modSealmaster.EndSealNo !== "" && modSealmaster.EndSealNo !== null) {
            if (parseInt(modSealmaster.EndSealNo) <= parseInt(modSealmaster.StartSealNo)) {
                validationErrors["EndSealNo"] = "SealMaster_Endseal_comp";
            }
        }
        if (modSealmaster.CurrentSealNo !== "" && modSealmaster.CurrentSealNo !== null) {
            if ((parseInt(modSealmaster.CurrentSealNo)) > parseInt(modSealmaster.EndSealNo) || (parseInt(modSealmaster.CurrentSealNo)) < parseInt(modSealmaster.StartSealNo - 1)) {
                validationErrors["CurrentSealNo"] = "SealMaster_CurrentSeal_comp";
            }
        }
        if (returnValue)
            returnValue = Object.values(validationErrors).every(function (value) {
                return value === "";
            });


        return returnValue;
    }

    CreateSealMaster(modSealmaster) {
        let keyCode = [
            {
                key: KeyCodes.sealMasterCode,
                value: modSealmaster.Code,
            },
        ];
        let obj = {
            keyDataCode: KeyCodes.sealMasterCode,
            KeyCodes: keyCode,
            Entity: modSealmaster,
        };

        let notification = {
            messageType: "critical",
            message: "SealMasterDetails_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: ["SealMasterDetails_Code"],
                    keyValues: [modSealmaster.Code],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };

        axios(
            RestAPIs.CreateSealMaster,
            Utilities.getAuthenticationObjectforPost(
                obj,
                this.props.tokenDetails.tokenInfo
            )
        ).then((response) => {
            let result = response.data;
            notification.messageType = result.IsSuccess ? "success" : "critical";
            console.log(result)
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
                this.setState(
                    {
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnSealMaster
                    ),
                    showAuthenticationLayout: false,

                    },
                    () => this.getSealMaster({ Common_Code: modSealmaster.Code })
                );
            } else {
                notification.messageResultDetails[0].errorMessage =
                    result.ErrorList[0];
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnSealMaster
                  ),
                  showAuthenticationLayout: false,

                });
                console.log("Error in SealMaster:", result.ErrorList);
            }
            this.props.onSaved(this.state.modSealmaster, "add", notification);
        })
            .catch((error) => {
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnSealMaster
                  ),
                  showAuthenticationLayout: false,

                });
                notification.messageResultDetails[0].errorMessage = error;
                this.props.onSaved(this.state.modSealmaster, "add", notification);
            });
    }

    convertStringtoDecimal(modSealMaster, attributeList) {
        try {
          
            modSealMaster = this.fillAttributeDetails(modSealMaster, attributeList);
          return modSealMaster;
        } catch (err) {
          console.log("convertStringtoDecimal error sealMaster Details", err);
        }
      }

    updateSealMaster(modSealmaster) {
        let keyCode = [
            {
                key: KeyCodes.sealMasterCode,
                value: modSealmaster.sealMasterCode,
            },
        ];
        let obj = {
            keyDataCode: KeyCodes.sealMasterCode,
            KeyCodes: keyCode,
            Entity: modSealmaster,
        };

        let notification = {
            messageType: "critical",
            message: "SealMasterDetails_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: ["SealMasterDetails_Code"],
                    keyValues: [modSealmaster.Code],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };

        axios(
            RestAPIs.UpdateSealMaster,
            Utilities.getAuthenticationObjectforPost(
                obj,
                this.props.tokenDetails.tokenInfo
            )
        ).then((response) => {
            let result = response.data;
            notification.messageType = result.IsSuccess ? "success" : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
                this.setState(
                    {
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnSealMaster
                    ),
                    showAuthenticationLayout: false,

                    },
                    () => this.getSealMaster({ Common_Code: modSealmaster.Code })
                );
            } else {
                notification.messageResultDetails[0].errorMessage =
                    result.ErrorList[0];
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.modify,
                        fnSealMaster
                  ),
                  showAuthenticationLayout: false,

                });
                console.log("Error in update SealMaster:", result.ErrorList);
            }
            this.props.onSaved(this.state.modSealmaster, "update", notification);
        })
            .catch((error) => {
                this.setState({
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.modify,
                        fnSealMaster
                  ),
                  showAuthenticationLayout: false,

                });
                notification.messageResultDetails[0].errorMessage = error;
                this.props.onSaved(this.state.modSealmaster, "modify", notification);
            });
    }


    handleCellDataEdit = (attribute, value) => {
        try {
          attribute.DefaultValue = value;
          this.setState({
            attribute: attribute,
          });
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
          this.setState({ attributeValidationErrors });
        } catch (error) {
          console.log(
            "SealmasterDetailsComposite:Error occured on handleCellDataEdit",
            error
          );
        }
      };

    render() {
        console.log(this.props.userDetails)
        const popUpContents = [
            {
                fieldName: "SealMaster_LastUpdatedTime",
                fieldValue:
                    new Date(this.state.modSealmaster.LastUpdatedTime).toLocaleDateString() +
                    " " +
                    new Date(this.state.modSealmaster.LastUpdatedTime).toLocaleTimeString(),
            },
           
            {
                fieldName: "SealMaster_CreatedTime",
                fieldValue:
                    new Date(this.state.modSealmaster.CreatedTime).toLocaleDateString() +
                    " " +
                    new Date(this.state.modSealmaster.CreatedTime).toLocaleTimeString(),
            },
            {
                fieldName: "SealMasterList_LastUpdatedBy",
                fieldValue:this.state.modSealmaster.LastUpdatedBy
                   
            },
        ];
        return this.state.isReadyToRender ? (
            <div>
                <ErrorBoundary>
                    <TMDetailsHeader
                        entityCode={this.state.sealmaster.Code}
                        newEntityName="SealMaster_NewDetail"
                        popUpContents={popUpContents}

                    ></TMDetailsHeader>
                </ErrorBoundary>
                <ErrorBoundary>
                    <SealMasterDetails
                        sealmaster={this.state.sealmaster}
                        modSealmaster={this.state.modSealmaster}
                        validationErrors={this.state.validationErrors}
                        onFieldChange={this.handleChange}
                        isEnterpriseNode={this.props.userDetails.EntityResult.IsEnterpriseNode}
                        attributeValidationErrors={this.state.attributeValidationErrors}
                        selectedAttributeList={this.state.selectedAttributeList}
                        handleCellDataEdit={this.handleCellDataEdit}
                        >
                    </SealMasterDetails>
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
                  this.state.sealmaster.Code === ""
                    ? functionGroups.add
                    : functionGroups.modify
                }
                functionGroup={fnSealMaster}
                handleOperation={this.saveSealMaster}
                handleClose={this.handleAuthenticationClose}
              ></UserAuthenticationLayout>
            ) : null}
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

export default connect(mapStateToProps)(SealMasterDetailsComposite);

SealMasterDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    terminalCodes: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
};

