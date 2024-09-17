 import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyBayGroup } from "../../../JS/DefaultEntities";
import { bayGroupValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { functionGroups, fnBayGroup, fnKPIInformation } from "../../../JS/FunctionGroups";
import  BayGroupDetails  from "../../UIBase/Details/BayGroupDetails";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { KpiBayGroupDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class BayGroupDetailsComposite extends Component {
    state = {
        bayGroup: {},
        modBayGroup: {},
        validationErrors: Utilities.getInitialValidationErrors(bayGroupValidationDef),
        isReadyToRender: false,
        saveEnabled: false,
        lookUpData: null,
        isEnable: true,
        modAvailablebayList: [],
        selectedbays: [],
        checkedBays: [],
        bayGroupKPIList:[],
        tempBayGroup: {}
    }

    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            // this.getBayGroup(this.props.selectedRow);
            this.GetBayList();
        } catch (error) {
            console.log(
                "BaygroupDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        try {
            if (
                this.state.bayGroup.GroupName !== "" &&
                nextProps.selectedRow.GroupName === undefined &&
                this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
            ) {
                this.getBayGroup(nextProps.selectedRow);
                let validationErrors = { ...this.state.validationErrors };
                Object.keys(validationErrors).forEach((key) => {
                    validationErrors[key] = "";
                });
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "baygroupDetailsComposite:Error occured on componentWillReceiveProps",
                error
            );
        }
    }
   
    getBayGroup(bayGroupRow) {
        try {
            emptyBayGroup.BayList = this.state.modAvailablebayList;
            if (bayGroupRow.GroupName === undefined) {
                this.setState({
                    bayGroup: lodash.cloneDeep(emptyBayGroup),
                    modBayGroup: lodash.cloneDeep(emptyBayGroup),
                    isReadyToRender: true,
                    modAvailablebayList: lodash.cloneDeep(emptyBayGroup.BayList),
                    checkedBays: [],
                    selectedbays: [],
                    bayGroupKPIList:[],
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnBayGroup
                    ),
                });
                return;
            }
            axios(
                RestAPIs.GetBayGroup + "?bayGroupName=" +
                bayGroupRow.GroupName,
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                var result = response.data;
                if (result.IsSuccess === true && result.EntityResult.length > 0) {
                    let checkedList = [];
                      result.EntityResult[0].BayList.forEach((Bays) => {
              var selectBay = this.state.modAvailablebayList.find(
                (allBay) => {
                  return allBay.BayCode === Bays.BayCode;
                }
              );
              checkedList.push(selectBay);
            });
                    this.setState(
                        {
                            isReadyToRender: true,
                            bayGroup: lodash.cloneDeep(result.EntityResult[0]),
                            modBayGroup: lodash.cloneDeep(result.EntityResult[0]),
                            selectedbays: checkedList,
                            // selectedbays:lodash.cloneDeep(this.state.selectedbays),
                            saveEnabled: Utilities.isInFunction(
                                this.props.userDetails.EntityResult.FunctionsList,
                                functionGroups.modify,
                                fnBayGroup
                            )
                            
                        }, () => this.getKPIList(this.props.selectedShareholder, result.EntityResult[0].bayGroupCode)
                    );
                } else {
                    this.setState({
                        bayGroup: lodash.cloneDeep(emptyBayGroup),
                        modBayGroup: lodash.cloneDeep(emptyBayGroup),
                        isReadyToRender: true,
                        modAvailablebayList: lodash.cloneDeep(emptyBayGroup.BayList),
                        selectedbays: [],

                    });
                    console.log("Error in getbaygroup:", result.ErrorList);
                }
            })
             }catch(error)  {
                    console.log("Error while getbaygroup:", error, bayGroupRow);
                };
        }

    GetBayList() {
        try {
            axios(
                RestAPIs.GetBayList,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (
                            Array.isArray(result.EntityResult.Table) &&
                            result.EntityResult.Table.length >= 0
                        )
                            this.setState({ modAvailablebayList: result.EntityResult.Table },
                                () => {
                                    this.getBayGroup(this.props.selectedRow);
                                });
                    } else {
                        this.setState({ modAvailablebayList: [] });
                        console.log("Error in getbayList:", result.ErrorList);
                    }
            
                })
                .catch((error) => {
                    this.setState({ modAvailablebayList: [] });
                    console.log("Error while getting getbayList:", error);
                });
        }catch(error)  {
                    console.log("Error while getbayList:", error);
                };
  }
    handleBaySelectionChange = (bays) => {
        this.setState({ selectedbays: bays });
  };
    handleChange = (propertyName, data) => {
        try {
            const modBayGroup = lodash.cloneDeep(this.state.modBayGroup);
            modBayGroup[propertyName] = data;
            this.setState({ modBayGroup });

            const validationErrors = lodash.cloneDeep(this.state.validationErrors);
            if (bayGroupValidationDef[propertyName] !== undefined) {
                validationErrors[propertyName] = Utilities.validateField(
                    bayGroupValidationDef[propertyName],
                    data
                );
                this.setState({ validationErrors });
            }
        } catch (error) {
            console.log(
                "BayGroupDetailsComposite:Error occured on handleChange",
                error
            );
        }
    };

    handleReset = () => {
        try {
            const { validationErrors } = { ...this.state };
            const bayGroup = lodash.cloneDeep(this.state.bayGroup);
            Object.keys(validationErrors).forEach(function (key) {
                validationErrors[key] = "";
            });
            if (bayGroup.BayList.length > 0 && bayGroup.BayList !=="") {
                let checkedBayList =[]
                    bayGroup.BayList.forEach((Bays) => {
                    var selectBay = this.state.modAvailablebayList.find(
                        (allBay) => {
                            return allBay.BayCode === Bays.BayCode;
                        }
                    );
                    checkedBayList.push(selectBay);
                })
                this.setState({
                    modBayGroup: { ...bayGroup },
                    selectedbays: checkedBayList,
                    validationErrors,
                });
               
            }
            else {
                this.setState({
                    modBayGroup: { ...bayGroup },
                    validationErrors,
                })
            }
        } catch (error) {
            console.log("bayGroupDetailsComposite:Error occured on handleReset", error);
        }
    };

    saveBayGroup = () => {
        try {
          this.setState({ saveEnabled: false });
          let tempBayGroup = lodash.cloneDeep(this.state.tempBayGroup);
    
          this.state.bayGroup.GroupName === ""
                    ? this.CreateBayGroup(tempBayGroup)
                    : this.updateBayGroup(tempBayGroup);
    
        } catch (error) {
          console.log("BayGroupDetails Composite : Error in saveBayGroup");
        }
      };

    handleSave = () => {
        try {
            this.handleAuthenticationClose();
            // let modBayGroup = this.fillDetails();
             let modBayGroup = lodash.cloneDeep(this.state.modBayGroup);
            modBayGroup.BayList=lodash.cloneDeep(this.state.selectedbays)
             
            if (this.validateSave(modBayGroup)) {
               
                let showAuthenticationLayout =
                this.props.userDetails.EntityResult.IsWebPortalUser !== true
                  ? true
                  : false;
              let tempBayGroup = lodash.cloneDeep(modBayGroup);
              this.setState({ showAuthenticationLayout, tempBayGroup }, () => {
                if (showAuthenticationLayout === false) {
                  this.saveBayGroup();
                }
            });

            } else this.setState({ saveEnabled: true });
        }
        catch (error) {
            console.log("BayGroupDetailsComposite:Error occured on handleSave", error);
        }
    };

    // fillDetails() {
    //     try {
    //         let modBayGroup = lodash.cloneDeep(this.state.modBayGroup);
    //         modBayGroup.BayList=lodash.cloneDeep(this.state.selectedbays)
    //         this.setState({ modBayGroup });
    //         return modBayGroup;
    //     } catch (error) {
    //         console.log("BayGroupDetailsComposite:Error occured on fillAttributeDetails", error);
    //     }
    // }
    validateSave(modBayGroup) {
        try { 
        var validationErrors = lodash.cloneDeep(this.state.validationErrors);
        Object.keys(bayGroupValidationDef).forEach(function (key) {
            validationErrors[key] = Utilities.validateField(
                bayGroupValidationDef[key],
                modBayGroup[key]
            );
        });
        let notification = {
            messageType: "critical",
            message: ["BayGroup_Saved_Status"],
            messageResultDetails: [],
        };
        if (modBayGroup.BayList.length === 0) {
            notification.messageResultDetails.push({
                keyFields: ["Groupname"],
                keyValues: [modBayGroup.GroupName],
                isSuccess: false,
                errorMessage: "BayGroup_PleaseSelectAtleastOneBay",
            });
        }
        this.setState({ validationErrors });
        var returnValue = true;
        if (returnValue)
            returnValue = Object.values(validationErrors).every(function (value) {
                return value === "";
            });
        if (notification.messageResultDetails.length > 0) {
            this.props.onSaved(this.state.modBayGroup, "update", notification);
            return false;
        }
        return returnValue;
    } catch(error) {
        console.log("Error while Validate Save",error)
    }
    }
    CreateBayGroup(modBayGroup) {
        try {
            this.handleAuthenticationClose();
            let keyCode = [
                {
                    key: KeyCodes.bayGroup,
                    value: modBayGroup.GroupName,
                },
            ];
            let obj = {
                keyDataCode: KeyCodes.bayGroup,
                KeyCodes: keyCode,
                Entity: modBayGroup,
            };

            let notification = {
                messageType: "critical",
                message: "BayGroup_Saved_Status",
                messageResultDetails: [
                    {
                        keyFields: ["BayGroupList_Name"],
                        keyValues: [modBayGroup.GroupName],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };

            axios(
                RestAPIs.CreateBayGroup,
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
                                fnBayGroup
                            ),
                        },
                        () => this.getBayGroup({ GroupName: modBayGroup.GroupName })
                    );
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnBayGroup
                        ),
                    });
                    console.log("Error in BayGroup:", result.ErrorList);
                }
                this.props.onSaved(this.state.modBayGroup, "add", notification);
            })
                .catch((error) => {
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnBayGroup
                        ),
                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(this.state.modBayGroup, "add", notification);
                });
        } catch (error)
        {
            console.log("Error while createbaygroup",error)
        }
    }
    updateBayGroup(modBayGroup) {
        try {
            this.handleAuthenticationClose();
            let keyCode = [
                {
                    key: KeyCodes.bayGroup,
                    value: modBayGroup.GroupName
                },
            ];
            let obj = {
                keyDataCode: KeyCodes.bayGroup,
                KeyCodes: keyCode,
                Entity: modBayGroup,
            };

            let notification = {
                messageType: "critical",
                message: "BayGroup_SavedSuccess",
                messageResultDetails: [
                    {
                        keyFields: ["BayGroupList_Name"],
                        keyValues: [modBayGroup.GroupName],
                        isSuccess: false,
                        errorMessage: "",
                    },
                ],
            };

            axios(
                RestAPIs.UpdateBayGroup,
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
                                fnBayGroup
                            ),
                        },
                        () => this.getBayGroup({ GroupName: modBayGroup.GroupName })
                    );
                } else {
                    notification.messageResultDetails[0].errorMessage =
                        result.ErrorList[0];
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnBayGroup
                        ),
                    });
                    console.log("Error in update BayGroup:", result.ErrorList);
                }
                this.props.onSaved(this.state.modBayGroup, "update", notification);
            })
                .catch((error) => {
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.modify,
                            fnBayGroup
                        ),
                    });
                    notification.messageResultDetails[0].errorMessage = error;
                    this.props.onSaved(this.state.modBayGroup, "modify", notification);
                });
        } catch (error) {
            console.log("Error while updatebaygroup",error)
        }
    }
    getKPIList(bayGroupCode) {
        let KPIView = Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.view,
            fnKPIInformation
        );
        if (KPIView === true) {
            let objKPIRequestData = {
                PageName: KpiBayGroupDetail,
                InputParameters: [{ key: "BayGroupCode", value: bayGroupCode }],
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
                            bayGroupKPIList: result.EntityResult.ListKPIDetails,
                        });
                    } else {
                        this.setState({ bayGroupKPIList: [] });
                        console.log("Error in baygroup KPIList:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    console.log("Error while getting baygroup KPIList:", error);
                });
        }
    }

    handleAuthenticationClose = () => {
        this.setState({
          showAuthenticationLayout: false,
        });
      };

    render() {
        const popUpContents = [
            {
                fieldName: "BayGroupList_LastUpdated",
                fieldValue:
                    new Date(this.state.modBayGroup.LastUpdatedTime).toLocaleDateString() +
                    " " +
                    new Date(this.state.modBayGroup.LastUpdatedTime).toLocaleTimeString(),
            },
           
            {
                fieldName: "BayGroupList_CreatedTime",
                fieldValue:
                    new Date(this.state.modBayGroup.CreatedTime).toLocaleDateString() +
                    " " +
                    new Date(this.state.modBayGroup.CreatedTime).toLocaleTimeString(),
            },
        ];
        return this.state.isReadyToRender ? (
            <div>
                <ErrorBoundary>
                    <TMDetailsHeader
                        entityCode={this.state.bayGroup.GroupName}
                        newEntityName="BayGroupDetails_NewBayGroup"
                        popUpContents={popUpContents}
                    ></TMDetailsHeader>
                </ErrorBoundary>
                <TMDetailsKPILayout KPIList={this.state.bayGroupKPIList}> </TMDetailsKPILayout>

                <ErrorBoundary>
                    <BayGroupDetails
                    bayGroup={this.state.bayGroup}
                        modBayGroup={this.state.modBayGroup}
                        modAvailablebayList={this.state.modAvailablebayList}
                        validationErrors={this.state.validationErrors}
                        selectedbays={this.state.selectedbays}
                        onFieldChange={this.handleChange}
                        handleBaySelectionChange={this.handleBaySelectionChange}
                        isEnterpriseNode={this.props.userDetails.EntityResult.IsEnterpriseNode}
                    >
                    </BayGroupDetails>
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
                        this.state.bayGroup.GroupName === ""
                        ? functionGroups.add
                        : functionGroups.modify
                    }
                    functionGroup={fnBayGroup}
                    handleOperation={this.saveBayGroup}
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

export default connect(mapStateToProps)(BayGroupDetailsComposite);

BayGroupDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    terminalCodes: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
};

           
