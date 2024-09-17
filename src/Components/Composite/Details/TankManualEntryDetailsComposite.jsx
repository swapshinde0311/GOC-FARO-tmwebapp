import React, { Component } from "react";
import { TankManualEntryDetails } from "../../UIBase/Details/TankManualEntryDetails";

import lodash from "lodash";
import * as Utilities from "../../../JS/Utilities";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "./../../../JS/Constants";
import { tankManualEntryDetailsDef } from "../../../JS/DetailsTableValidationDef";
import { functionGroups, fnTankEODEntry } from "../../../JS/FunctionGroups";
import axios from "axios";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class TankManualEntryDetailsComposite extends Component {
  state = {
    entryDate: new Date(),
    isReadyToRender: false,
    associations: [],
    modAssociations: [],
    selectedAssociations: [],
    tankCodeOptions: [],
    tankCodeSearchOptions: [],
    baseProductCodeOptions: [],
    quantityUOMOptions: [],
    massQuantityUOMOptions: [],
    saveEnabled: false,
    showAuthenticationLayout: false,
    tempAssociations: {},
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getTankCodes(this.props.userDetails.EntityResult.PrimaryShareholder);
      this.getBaseProductCodes();
      this.getUOMs();
      this.getTankManualEntryData(this.state.entryDate);
    } catch (error) {
      console.log(
        "TankManualEntryDetailsComposite: Error occurred on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps() {
    try {
      this.getTankManualEntryData(this.state.entryDate);
    } catch (error) {
      console.log(
        "TankManualEntryDetailsComposite: Error occurred on componentWillReceiveProps",
        error
      );
    }
  }

  getTankCodes(shareholder) {
    axios(
      RestAPIs.GetTanks + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const tankCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let tankCodeSearchOptions = lodash.cloneDeep(tankCodeOptions);
            if (tankCodeSearchOptions.length > Constants.filteredOptionsCount) {
              tankCodeSearchOptions = tankCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({
              tankCodeOptions,
              tankCodeSearchOptions,
            });
          }
        } else {
          console.log("Error in getTankCode:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getTankCode:", error);
      });
  }

  getBaseProductCodes() {
    axios(
      RestAPIs.GetBaseProducts,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            result.EntityResult !== undefined
          ) {
            const productList = [];
            for (let key in result.EntityResult) {
              for (let productCode of result.EntityResult[key]) {
                productList.push(productCode);
              }
            }
            this.setState({
              baseProductCodeOptions: Utilities.transferListtoOptions(
                productList
              ),
            });
          }
        } else {
          console.log("Error in getBaseProductList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Base Product List:", error);
      });
  }

  getUOMs() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult.VOLUME)
          ) {
            const quantityUOMOptions = [];
            const massQuantityUOMOptions = [];
            result.EntityResult.VOLUME.forEach((UOM) => {
              quantityUOMOptions.push({
                text: UOM,
                value: UOM,
              });
            });
            result.EntityResult.MASS.forEach((UOM) => {
              quantityUOMOptions.push({
                text: UOM,
                value: UOM,
              });
              massQuantityUOMOptions.push({
                text: UOM,
                value: UOM,
              });
            });
            this.setState({ quantityUOMOptions, massQuantityUOMOptions });
          }
        } else {
          console.log("Error in GetUOMList:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in GetUOMList:", error);
      });
  }

  getTankManualEntryData(entryDate) {
    axios(
      RestAPIs.GetTankEODData + "?EntryDate=" + entryDate.toISOString(),
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        const result = response.data;
        if (result.IsSuccess === true) {
          const associations =
            result.EntityResult === null ? [] : result.EntityResult;
          this.setState({
            isReadyToRender: true,
            associations: associations,
            modAssociations: lodash.cloneDeep(associations),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnTankEODEntry
            ),
          });
        } else {
          this.setState({
            isReadyToRender: true,
            associations: [],
            modAssociations: [],
            saveEnabled: false,
          });
          console.log("Error in getTankManualEntryData:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting TankManualEntryData:", error);
      });
  }

  handleAssociationSelectionChange = (e) => {
    this.setState({ selectedAssociations: e });
  };

  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        const modAssociations = lodash.cloneDeep(this.state.modAssociations);
        const newComp = {
          BaseProductCode: "",
          BOPGrossVolume: "",
          BOPMassVolume: "",
          BOPNetVolume: "",
          EOPGrossVolume: "",
          EOPMassVolume: "",
          EOPNetVolume: "",
          MassQuantityUOM: "",
          QuantityUOM: "",
          ReconciliationCode: "",
          TransactionTotalGrossQty: "",
          TransactionTotalNetQty: "",
          TankCode: "",
        };
        newComp.SeqNumber = Utilities.getMaxSeqNumberfromListObject(
          this.state.modAssociations
        );
        modAssociations.push(newComp);
        this.setState({
          modAssociations,
          selectedAssociations: [],
        });
      } catch (error) {
        console.log(
          "TankManualEntryDetailsComposite: Error occurred on handleAddAssociation",
          error
        );
      }
    }
  };

  handleDeleteAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedAssociations != null &&
          this.state.selectedAssociations.length > 0
        ) {
          if (this.state.modAssociations.length > 0) {
            let modAssociations = lodash.cloneDeep(this.state.modAssociations);

            this.state.selectedAssociations.forEach((obj, index) => {
              modAssociations = modAssociations.filter((com, cindex) => {
                return com.SeqNumber !== obj.SeqNumber;
              });
            });

            this.setState({ modAssociations });
          }
        }

        this.setState({ selectedAssociations: [] });
      } catch (error) {
        console.log(
          "TankManualEntryDetailsComposite: Error occurred on handleDeleteAssociation",
          error
        );
      }
    }
  };

  handleChange = (propertyName, data) => {
    try {
      this.getTankManualEntryData(data);
      this.setState({ entryDate: data });
    } catch (error) {
      console.log(
        "TankManualEntryDetailsComposite: Error occurred on handleChange",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);
    modAssociations[cellData.rowIndex][cellData.field] = newVal;
    this.setState({ modAssociations });
  };

  handleTankSearchChange = (tankCode) => {
    try {
      let tankCodeSearchOptions = this.state.tankCodeOptions.filter((item) =>
        item.value.toLowerCase().includes(tankCode.toLowerCase())
      );

      if (tankCodeSearchOptions.length > Constants.filteredOptionsCount) {
        tankCodeSearchOptions = tankCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        tankCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "TankManualEntryDetailsComposite: Error occurred on handleTankSearchChange",
        error
      );
    }
  };

  getTankCodeSearchOptions() {
    let tankCodeSearchOptions = lodash.cloneDeep(
      this.state.tankCodeSearchOptions
    );
    // let modTankCode = this.state.modLeakageManualEntry.TankCode;
    // if (
    //   modTankCode !== null &&
    //   modTankCode !== "" &&
    //   modTankCode !== undefined
    // ) {
    //   let selectedTankCode = tankCodeSearchOptions.find(
    //     (element) => element.value.toLowerCase() === modTankCode.toLowerCase()
    //   );
    //   if (selectedTankCode === undefined) {
    //     tankCodeSearchOptions.push({
    //       text: modTankCode,
    //       value: modTankCode,
    //     });
    //   }
    // }
    return tankCodeSearchOptions;
  }

  handleTankManualEntry = () => {
    this.setState({ saveEnabled: false });
    this.handleAuthenticationClose();
    let tempAssociations = lodash.cloneDeep(this.state.tempAssociations);
    for (let item of tempAssociations) {
      item.EOPGrossVolume = Utilities.convertStringtoDecimal(item.EOPGrossVolume);
      item.EOPNetVolume = Utilities.convertStringtoDecimal(item.EOPNetVolume);
      item.EOPMassVolume = Utilities.convertStringtoDecimal(item.EOPMassVolume);
      item.MassQuantityUOM = Utilities.convertStringtoDecimal(item.MassQuantityUOM);
    }
    const isAdd = this.state.associations.length === 0;
    this.updateTankEODData(isAdd, tempAssociations);
  };


  handleSave = () => {
    try {
    
      const modAssociations = lodash.cloneDeep(this.state.modAssociations);
      if (this.validateSave(modAssociations)) {

        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempAssociations = lodash.cloneDeep(modAssociations);
      this.setState({ showAuthenticationLayout, tempAssociations }, () => {
        if (showAuthenticationLayout === false) {
          this.handleTankManualEntry();
        }
    });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "TankManualEntryDetailsComposite: Error occurred on handleSave",
        error
      );
    }
  };

  validateSave(modAssociations) {
    const notification = {
      messageType: "critical",
      message: "TankEODEntry_SavedStatus",
      messageResultDetails: [],
    };

    if (Array.isArray(modAssociations) && modAssociations.length > 0) {
      modAssociations.forEach((compart) => {
        tankManualEntryDetailsDef.forEach((col) => {
          let err = "";

          if (col.validator !== undefined) {
            err = Utilities.validateField(col.validator, compart[col.field]);
          }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: [col.displayName],
              keyValues: [compart[col.field]],
              isSuccess: false,
              errorMessage: err,
            });
          }
        });
        if (
          (compart.EOPMassVolume === "" && compart.MassQuantityUOM !== "") ||
          (compart.MassQuantityUOM === "" && compart.EOPMassVolume !== "")
        ) {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "MassQtyMassUOM_ProvidedTogether",
          });
        } else if (compart.EOPMassVolume < 0) {
          notification.messageResultDetails.push({
            keyFields: [],
            keyValues: [],
            isSuccess: false,
            errorMessage: "TankManualEntry_MassQtyNonNegative",
          });
        }
      });
    } else {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRMSG_RECONCILIATIONTANKDATALIST_EMPTY",
      });
    }

    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modRailReceipt, "update", notification);
      return false;
    }
    return true;
  }

  updateTankEODData(isAdd, modAssociations) {
    const keyCode = [
      {
        key: "EntryDate",
        value: this.state.entryDate,
      },
    ];
    const obj = {
      ShareHolderCode: this.props.selectedShareholder,
      KeyCodes: keyCode,
      Entity: modAssociations,
    };
    const notification = {
      messageType: "critical",
      message: "TankEODEntry_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["TankEODEntry_EODEntryDate"],
          keyValues: [this.state.entryDate.toLocaleDateString()],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      isAdd ? RestAPIs.CreateTankManualEntry : RestAPIs.UpdateTankManualEntry,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.getTankManualEntryData(this.state.entryDate);
        } else {
          this.setState({
            saveEnabled: true,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in updateTankEODData:", result.ErrorList);
        }
        this.props.onSaved(this.state.modAssociations, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(this.state.modAssociations, "modify", notification);
        this.setState({
          saveEnabled: true,
        });
      });
  }

  handleReset = () => {
    try {
      this.setState({
        entryDate: new Date(),
        modAssociations: [],
      });
    } catch (error) {
      console.log(
        "TankManualEntryDetailsComposite: Error occurred on handleSave",
        error
      );
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TankManualEntryDetails
            entryDate={this.state.entryDate}
            modAssociations={this.state.modAssociations}
            selectedAssociations={this.state.selectedAssociations}
            listOptions={{
              tankCode: this.getTankCodeSearchOptions(),
              baseProductCode: this.state.baseProductCodeOptions,
              quantityUOM: this.state.quantityUOMOptions,
              densityQuantityUOM: this.state.massQuantityUOMOptions,
            }}
            onFieldChange={this.handleChange}
            onTankSearchChange={this.handleTankSearchChange}
            handleAddAssociation={this.handleAddAssociation}
            handleDeleteAssociation={this.handleDeleteAssociation}
            handleAssociationSelectionChange={
              this.handleAssociationSelectionChange
            }
            handleCellDataEdit={this.handleCellDataEdit}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div className="row">
                <div className="col" style={{ textAlign: "right" }}>
                  <Button
                    content={t("LookUpData_btnReset")}
                    className="cancelButton"
                    onClick={this.handleReset}
                  ></Button>
                  <Button
                    content={t("Save")}
                    disabled={!this.state.saveEnabled}
                    onClick={this.handleSave}
                  ></Button>
                </div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
        {this.state.showAuthenticationLayout ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={functionGroups.add}
            functionGroup={fnTankEODEntry}
            handleOperation={this.handleTankManualEntry}
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
const mapRouteToProps = (route) => {
  return {
    userAction: bindActionCreators(getUserDetails, route),
  };
};
export default connect(
  mapStateToProps,
  mapRouteToProps
)(TankManualEntryDetailsComposite);
