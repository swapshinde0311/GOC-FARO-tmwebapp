import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { WebPortalUserMapDetails } from "../../UIBase/Details/WebPortalUserMapDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import { emptyWebPortalUser } from "../../../JS/DefaultEntities";
import { webPortalUserValidationDef } from "../../../JS/ValidationDef";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import { functionGroups, fnWebPortalUserMap } from "../../../JS/FunctionGroups";
import { TranslationConsumer } from "@scuf/localization";
import { Modal, Button } from "@scuf/common";
import * as Constants from "../../../JS/Constants";

class WebPortalUserMapDetailsComposite extends Component {
    state = {
        webPortalUser: lodash.cloneDeep(emptyWebPortalUser),
        modWebPortalUser: {},
        validationErrors: Utilities.getInitialValidationErrors(
            webPortalUserValidationDef
        ),
        isReadyToRender: false,
        saveEnabled: false,
        securityUsers: [],
        availableEntities: [],
        selectedAvailableEntites: [],
        selectedAssociatedEntities: [],
        entityDisassociationPopUp:false
    }

  componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.getWebPortalUser(this.props.selectedRow);
            this.GetSecurityUsers();
          } catch (error) {
            console.log(
              "WebPortalUserMapDetailsComposite:Error occured on componentDidMount",
              error
            );
          }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.webPortalUser.UserName !== "" &&
        nextProps.selectedRow.WebPortal_UserName === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getWebPortalUser(nextProps.selectedRow);
        let validationErrors = { ...this.state.validationErrors };
        Object.keys(validationErrors).forEach((key) => {
          validationErrors[key] = "";
        });
        this.setState({ validationErrors });
      }
      
    } catch (error) {
      console.log(
        "WebPortalUserMapDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getWebPortalUser(selectedRow) {
        if (selectedRow.WebPortal_UserName === undefined) {
            this.setState({
                webPortalUser: lodash.cloneDeep(emptyWebPortalUser),
                modWebPortalUser: lodash.cloneDeep(emptyWebPortalUser),
                isReadyToRender: true,
                saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.add,
                    fnWebPortalUserMap
              ),
              availableEntities:[]
            }, () => {
              this.GetSecurityUsers();
            })
            return;
        }
        
        axios(
            RestAPIs.GetWebPortalUser+'?userName='+selectedRow.WebPortal_UserName,
            Utilities.getAuthenticationObjectforGet(
                this.props.tokenDetails.tokenInfo
            )
        )
          .then((response) => {
                var result = response.data;
                if (result.IsSuccess === true) {
                    this.setState({
                        isReadyToRender: false,
                        webPortalUser: lodash.cloneDeep(result.EntityResult),
                        modWebPortalUser: lodash.cloneDeep(result.EntityResult),
                        saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.modify,
                        fnWebPortalUserMap
                    ),
                    }, () => {
                      this.getEntityForPortalUser(result.EntityResult.UserName)
                    })
                }
                else {
                    this.setState({
                        webPortalUser: lodash.cloneDeep(emptyWebPortalUser),
                        modWebPortalUser: lodash.cloneDeep(emptyWebPortalUser),
                        isReadyToRender: true,
                    })
                }
            })
    }

    GetSecurityUsers() {
        try {
            axios(
                RestAPIs.GetSecurityUsers,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
              )
                .then((response) => {
                  var result = response.data;
                  if (result.IsSuccess === true) {
                    if (
                      result.EntityResult !== null &&
                      Array.isArray(result.EntityResult)
                    ) {
                      let securityUsers = Utilities.transferListtoOptions(
                        result.EntityResult
                      );
                      this.setState({ securityUsers });
                    }
                  } else {
                    console.log("Error in getUsers:", result.ErrorList);
                  }
                })
        }
        catch (error) {
            console.log("Error while getting getUsers:", error);
        } 
    }

    handleChange = (propertyName, data) => {
        try {
          const modWebPortalUser = lodash.cloneDeep(this.state.modWebPortalUser);
          modWebPortalUser[propertyName] = data;
          this.setState({ modWebPortalUser });
          const validationErrors = lodash.cloneDeep(this.state.validationErrors);
          if (webPortalUserValidationDef[propertyName] !== undefined) {
            validationErrors[propertyName] = Utilities.validateField(
                webPortalUserValidationDef[propertyName],
              data
            );
            this.setState({ validationErrors });
          }
        } catch (error) {
          console.log(
            "WebPortalUserMapDetailsComposite:Error occured on handleChange",
            error
          );
        }
    };
    
    handleReset = () => {
        try {
          const { validationErrors } = { ...this.state };
          const webPortalUser = lodash.cloneDeep(this.state.webPortalUser);
          Object.keys(validationErrors).forEach(function (key) {
            validationErrors[key] = "";
          });
          this.setState(
            {
              modWebPortalUser: { ...webPortalUser },
              selectedCompRow: [],
                  validationErrors,
                  availableEntities: [],
                  selectedAvailableEntites: [],
              selectedAssociatedEntities: [],
                  isReadyToRender:false
            }, () => {
              if (webPortalUser.UserName !== undefined && webPortalUser.UserName !== null && webPortalUser.UserName !== "")
                this.getEntityForPortalUser(webPortalUser.UserName);
              else
                this.setState({isReadyToRender:true})
            }
          );
        } catch (error) {
          console.log(
            "WebPortalUserMapDetailsComposite:Error occured on handleReset",
            error
          );
        }
    };
    
    handleUserChange = (data) => {
      try {
          let modWebPortalUser =  lodash.cloneDeep(emptyWebPortalUser);
          const validationErrors = lodash.cloneDeep(this.state.validationErrors);
          validationErrors["UserName"] = "";
            modWebPortalUser["UserName"] = data;
          this.setState({ modWebPortalUser, validationErrors,selectedAssociatedEntities:[], selectedAvailableEntites:[] }, () => {
            this.getEntityForPortalUser(data)
            });
        }
        catch (error) {
            console.log(
                "WebPortalUserMapDetailsComposite:Error occured on handleUserChange",
                error
              );
        }
  }
  
  getEntityForPortalUser =(data)=> {
    try {
      let modWebPortalUser = lodash.cloneDeep(this.state.modWebPortalUser);
      axios(
        RestAPIs.GetEntityForPortalUser +'?userName='+data+'&entityType=',
        Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
      )
        .then((response) => {
          var result = response.data;
            if (result.IsSuccess === true) {
                modWebPortalUser["RoleName"] = result.EntityResult.Table[0].RoleName;
                //modWebPortalUser["WebPortalUserEntityItems"]=[]
              if (result.EntityResult.Table[0].RoleName === Constants.WebPortalRoles.SHAREHOLDER) {
                modWebPortalUser.WebPortalUserEntityItems = result.EntityResult.Table1
                this.setState({
                  availableEntities: [],
                  modWebPortalUser,
                  isReadyToRender:true
            })
              }
              else {
                this.setState({
                  availableEntities: result.EntityResult.Table1,
                  modWebPortalUser,
                  isReadyToRender:true
            })
              }
          } else {
            console.log("Error in GetEntityForPortalUser:", result.ErrorList);
          }
        })
    } catch (error) {
      console.log(
        "WebPortalUserMapDetailsComposite:Error occured on getEntityForPortalUser",
        error
      );
    }
  }

    handleAvailableEntitySelection = (e) => {
        this.setState({ selectedAvailableEntites: e });
    }
    handleAssociatedEntitySelection = (e) => {
        this.setState({ selectedAssociatedEntities: e });
    }
    handleEntityAssociation = () => {
      try {
        this.setState({ isReadyToRender: false }, () => {
          const selectedAvailableEntites = lodash.cloneDeep(this.state.selectedAvailableEntites);
          let availableEntities = lodash.cloneDeep(this.state.availableEntities);
          let modWebPortalUser = lodash.cloneDeep(this.state.modWebPortalUser);
          selectedAvailableEntites.forEach((obj) => {
              modWebPortalUser.WebPortalUserEntityItems.push(obj);
              availableEntities = availableEntities.filter(
                  (com) => {
                    return (com.Code !==obj.Code);
                  });
          })
          this.setState({modWebPortalUser,selectedAvailableEntites:[],availableEntities,isReadyToRender:true});
          })
        } catch (error) {
            console.log("WebPortalUserMapDetailsComposite:Error occured on handleEntityAssociation",error);
        }
    }

    handleEntityDisassociation = () => {
        if(this.state.selectedAssociatedEntities.length > 0)
        this.setState({entityDisassociationPopUp:true})
    }

    EntityDisassociation = () => {
      try {
        this.setState({ isReadyToRender: false }, () => {
          const selectedAssociatedEntities = lodash.cloneDeep(this.state.selectedAssociatedEntities);
          let modWebPortalUser = lodash.cloneDeep(this.state.modWebPortalUser);
          let availableEntities = lodash.cloneDeep(this.state.availableEntities);
          selectedAssociatedEntities.forEach((obj, index) => {
              availableEntities.push(obj);
              modWebPortalUser.WebPortalUserEntityItems = modWebPortalUser.WebPortalUserEntityItems.filter(
                  (com, cindex) => {
                    return (com.Code !==obj.Code);
                  }
                );
          })
          this.setState({selectedAssociatedEntities:[],modWebPortalUser,availableEntities,isReadyToRender:true})
          })
           
        } catch (error) {
            console.log("WebPortalUserMapDetailsComposite:Error occured on handleEntityDisassociation",error);
        }
    }

    confirmEntityDisassociation = () => {
        return (
            <TranslationConsumer>
              {(t) => (
                <Modal open={this.state.entityDisassociationPopUp} size="small">
                  <Modal.Content>
                    <div className="col col-lg-12">
                      <h5>{t("WebPortal_ConfirmDisassociation")}</h5>
                    </div>
                  </Modal.Content>
                  <Modal.Footer>
                    <Button
                      type="primary"
                      content={t("AccessCardInfo_Ok")}
                      onClick={() => {
                        this.setState({ entityDisassociationPopUp: false }, () => {
                            this.EntityDisassociation();
                          });
                      }}
                    />
                    <Button
                      type="primary"
                      content={t("Cancel")}
                      onClick={() => {
                        this.setState({ entityDisassociationPopUp: false });
                      }}
                    />
                  </Modal.Footer>
                </Modal>
              )}
            </TranslationConsumer>
          );
    }

    handleSave = () => {
        try {
            let modWebPortalUser = this.fillDetails(); 
            this.setState({ saveEnabled: false });
            if (this.validateSave(modWebPortalUser)) {
                this.state.webPortalUser.UserName === ""
                ? this.createWebPortalUser(modWebPortalUser)
                : this.updateWebPortalUser(modWebPortalUser);
            } else this.setState({ saveEnabled: true });
        } catch (error) {
            console.log("WebPortalUserMapDetailsComposite:Error occured on handleSave",error);
        }
    }

  fillDetails() {
      try {
        let modWebPortalUser = lodash.cloneDeep(this.state.modWebPortalUser);
        let Entities = [];
          modWebPortalUser.WebPortalUserEntityItems.forEach(i => {
            let EntityData = {
                EntityType: i.EntityType === undefined ? i.Entity :i.EntityType,
                Code: i.Code,
                ShareholderCode:i.ShareholderCode
            }
            Entities.push(EntityData);
        });
        modWebPortalUser.WebPortalUserEntityItems = Entities;
        
            this.setState({ modWebPortalUser });
            return modWebPortalUser;
        }catch (error) {
            console.log(
              "WebPortalUserMapDetailsComposite:Error occured on fillDetails",
              error
            );
          }
    }

    validateSave(modWebPortalUser) {
        const validationErrors = { ...this.state.validationErrors };

        Object.keys(webPortalUserValidationDef).forEach(function (key) {
            if (modWebPortalUser[key] !== undefined)
              validationErrors[key] = Utilities.validateField(
                webPortalUserValidationDef[key],
                modWebPortalUser[key]
              );
        });
        
      this.setState({ validationErrors });
      
      let notification = {
        messageType: "critical",
        message: "WebPortaUserMap_SavedStatus",
        messageResultDetails: [],
      };

      if (modWebPortalUser.WebPortalUserEntityItems.length === 0) {
        notification.messageResultDetails.push({
          keyFields: ["WebPortal_UserName"],
          keyValues: [modWebPortalUser.UserName],
          isSuccess: false,
          errorMessage: "ASSOCIATED_ENTITY_ITEMS_EMPTY_X",
        });
      }

        let returnValue = Object.values(validationErrors).every(function (value) {
            return value === "";
          });
    
          if (notification.messageResultDetails.length > 0) {
            this.props.onSaved(this.state.modWebPortalUser, "update", notification);
            return false;
          }
          return returnValue;
    }

    createWebPortalUser(modWebPortalUser) {
        let obj = {
            Entity: modWebPortalUser,
          };
        let notification = {
            messageType: "critical",
            message: "WebPortaUserMap_SavedStatus",
            messageResultDetails: [
              {
                keyFields: ["WebPortal_UserName"],
                keyValues: [modWebPortalUser.UserName],
                isSuccess: false,
                errorMessage: "",
              },
            ],
        };
        
        axios(
            RestAPIs.CreateWebPortalUser,
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
                    saveEnabled: Utilities.isInFunction(
                      this.props.userDetails.EntityResult.FunctionsList,
                      functionGroups.modify,
                      fnWebPortalUserMap
                    ),
                  },
                  () => this.getWebPortalUser({ WebPortal_UserName: modWebPortalUser.UserName })
                );
              } else {
                notification.messageResultDetails[0].errorMessage =
                  result.ErrorList[0];
                this.setState({
                  saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.add,
                    fnWebPortalUserMap
                  ),
                });
                console.log("Error in createWebPortalUser:", result.ErrorList);
              }
              this.props.onSaved(this.state.modWebPortalUser, "add", notification);
            })
            .catch((error) => {
              this.setState({
                saveEnabled: Utilities.isInFunction(
                  this.props.userDetails.EntityResult.FunctionsList,
                  functionGroups.add,
                  fnWebPortalUserMap
                ),
              });
              notification.messageResultDetails[0].errorMessage = error;
              this.props.onSaved(this.state.modWebPortalUser, "add", notification);
            });
    }

  updateWebPortalUser(modWebPortalUser) {
    let obj = {
      Entity: modWebPortalUser,
    };

    let notification = {
      messageType: "critical",
      message: "WebPortaUserMap_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["WebPortal_UserName"],
          keyValues: [modWebPortalUser.UserName],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateWebPortalUser,
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
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnWebPortalUserMap
              ),
            },
            () => this.getWebPortalUser({ WebPortal_UserName: modWebPortalUser.UserName})
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnWebPortalUserMap
            ),
          });
          console.log("Error in update updateWebPortalUser:", result.ErrorList);
        }
        this.props.onSaved(this.state.modWebPortalUser, "update", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnWebPortalUserMap
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modWebPortalUser, "modify", notification);
      });
    }

    render() {
        const listOptions = {
            securityUsers: this.state.securityUsers,
            availableEntities: this.state.availableEntities,
            selectedAvailableEntities: this.state.selectedAvailableEntites,
            selectedAssociatedEntities:this.state.selectedAssociatedEntities
        }
        const popUpContents = [];
        
        return this.state.isReadyToRender ? (
            <div>
              <ErrorBoundary>
                <TMDetailsHeader
                  entityCode={this.state.webPortalUser.UserName}
                  newEntityName="WebPortalUserAssociation"
                  popUpContents={popUpContents}
                ></TMDetailsHeader>
              </ErrorBoundary>
              <ErrorBoundary>
                <WebPortalUserMapDetails
                  webPortalUser={this.state.webPortalUser}
                  modWebPortalUser={this.state.modWebPortalUser}
                  listOptions={listOptions}
                  validationErrors={this.state.validationErrors}
                  onFieldChange={this.handleChange}
                  onActiveStatusChange={this.handleActiveStatusChange}
                  onAllTerminalsChange={this.handleAllTerminalsChange}
                  isEnterpriseNode={
                    this.props.userDetails.EntityResult.IsEnterpriseNode
                  }
                  attributeValidationErrors={this.state.attributeValidationErrors}
                  selectedAttributeList={this.state.selectedAttributeList}
                        handleCellDataEdit={this.handleCellDataEdit}
                        userChange={this.handleUserChange}
                        handleAvailableEntitySelection={this.handleAvailableEntitySelection}
                        handleAssociatedEntitySelection={this.handleAssociatedEntitySelection}
                        handleEntityAssociation={this.handleEntityAssociation}
                handleEntityDisassociation={this.handleEntityDisassociation}
                pageSize={
                  this.props.userDetails.EntityResult.PageAttibutes
                    .WebPortalListPageSize
                }
                ></WebPortalUserMapDetails>
              </ErrorBoundary>
              <ErrorBoundary>
                <TMDetailsUserActions
                  handleBack={this.props.onBack}
                  handleSave={this.handleSave}
                  handleReset={this.handleReset}
                  saveEnabled={this.state.saveEnabled}
                ></TMDetailsUserActions>
                </ErrorBoundary>
                {this.state.entityDisassociationPopUp ? this.confirmEntityDisassociation() : null}
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
  
  export default connect(mapStateToProps)(WebPortalUserMapDetailsComposite);
  
  WebPortalUserMapDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
  };
  