import React, { Component } from "react";
import { LeakageManualEntryDetails } from "../../UIBase/Details/LeakageManualEntryDetails";

import lodash from "lodash";
import * as Utilities from "../../../JS/Utilities";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "./../../../JS/Constants";
import axios from "axios";
import { leakageManualEntryValidationDef } from "../../../JS/ValidationDef";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { emptyLeakageManualEntry } from "../../../JS/DefaultEntities";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  functionGroups,
  fnLeakageManualEntry,
} from "../../../JS/FunctionGroups";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";

class LeakageManualEntryDetailsComposite extends Component {
  state = {
    leakageManualEntry: {},
    modLeakageManualEntry: {},
    validationErrors: Utilities.getInitialValidationErrors(
      leakageManualEntryValidationDef
    ),
    isReadyToRender: false,
    productCategoryOptions: [],
    productCodeOptions: [],
    quantityUOMOptions: [],
    densityUOMOptions: [],
    tankCodeOptions: [],
    tankCodeSearchOptions: [],
    meterCodeOptions: [],
    meterCodeSearchOptions: [],
    saveEnabled: false,
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getProductCategory();
      this.getUOMList();
      this.getTankCode(this.props.userDetails.EntityResult.PrimaryShareholder);
      this.getMeterCode();
      this.setNewLeakageManualEntry();
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite: Error occurred on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps() {
    try {
      this.setNewLeakageManualEntry();
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite:Error occurred on componentWillReceiveProps",
        error
      );
    }
  }

  setNewLeakageManualEntry() {
    this.setState({
      leakageManualEntry: lodash.cloneDeep(emptyLeakageManualEntry),
      modLeakageManualEntry: lodash.cloneDeep(emptyLeakageManualEntry),
      isReadyToRender: true,
      saveEnabled: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.add,
        fnLeakageManualEntry
      ),
    });
  }

  getProductCategory() {
    try {
      const productCategoryOptions = [
        { text: "Base Product", value: "BaseProduct" },
        { text: "Additive", value: "Additive" },
      ];
      this.setState({ productCategoryOptions });
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite: Error occurred on getProductCategory",
        error
      );
    }
  }

  getProductCode(productCategory) {
    let apiAddress;
    if (productCategory === "BaseProduct") {
      apiAddress = RestAPIs.GetBaseProducts;
    } else if (productCategory === "Additive") {
      apiAddress = RestAPIs.GetAdditives;
    }
    axios(
      apiAddress,
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
              productCodeOptions: Utilities.transferListtoOptions(productList),
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

  getUOMList() {
    axios(
      RestAPIs.GetUOMList,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult.VOLUME)
          ) {
            const quantityUOMList = [
              ...result.EntityResult.VOLUME,
              ...result.EntityResult.MASS,
            ];
            this.setState({
              quantityUOMOptions: Utilities.transferListtoOptions(
                quantityUOMList
              ),
              densityUOMOptions: Utilities.transferListtoOptions(
                result.EntityResult.DENSITY
              ),
            });
          }
        } else {
          console.log("Error in getQuantityUOM:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getQuantityUOM:", error);
      });
  }

  getTankCode(shareholder) {
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

  getMeterCode() {
    axios(
      RestAPIs.GetMeters,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult !== null &&
            Array.isArray(result.EntityResult)
          ) {
            const meterCodeOptions = Utilities.transferListtoOptions(
              result.EntityResult
            );
            let meterCodeSearchOptions = lodash.cloneDeep(meterCodeOptions);
            if (
              meterCodeSearchOptions.length > Constants.filteredOptionsCount
            ) {
              meterCodeSearchOptions = meterCodeSearchOptions.slice(
                0,
                Constants.filteredOptionsCount
              );
            }
            this.setState({
              meterCodeOptions,
              meterCodeSearchOptions,
            });
          }
        } else {
          console.log("Error in getMeterCode:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error in getMeterCode:", error);
      });
  }

  handleChange = (propertyName, data) => {
    try {
      let modLeakageManualEntry = lodash.cloneDeep(
        this.state.modLeakageManualEntry
      );
      modLeakageManualEntry[propertyName] = data;

      if (propertyName === "ProductCategory") {
        this.getProductCode(data);
      }

      const validationErrors = lodash.cloneDeep(this.state.validationErrors);

      if (leakageManualEntryValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          leakageManualEntryValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modLeakageManualEntry });
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite: Error occurred on handleChange",
        error
      );
    }
  };

  handleSave = () => {
    this.setState({ saveEnabled: false });
    const modLeakageManualEntry = lodash.cloneDeep(
      this.state.modLeakageManualEntry
    );
    modLeakageManualEntry.UpdatedTime = new Date();
    if (this.validateSave(modLeakageManualEntry)) {
      modLeakageManualEntry.NetQuantity = Utilities.convertStringtoDecimal(
        modLeakageManualEntry.NetQuantity
      );
      modLeakageManualEntry.Density = Utilities.convertStringtoDecimal(
        modLeakageManualEntry.Density
      );
      modLeakageManualEntry.NetEndTotalizer = Utilities.convertStringtoDecimal(
        modLeakageManualEntry.NetEndTotalizer
      );
      modLeakageManualEntry.NetStartTotalizer = Utilities.convertStringtoDecimal(
        modLeakageManualEntry.NetStartTotalizer
      );
      modLeakageManualEntry.GrossEndTotalizer = Utilities.convertStringtoDecimal(
        modLeakageManualEntry.GrossEndTotalizer
      );
      modLeakageManualEntry.GrossStartTotalizer = Utilities.convertStringtoDecimal(
        modLeakageManualEntry.GrossStartTotalizer
      );
      modLeakageManualEntry.LeakageQty = Utilities.convertStringtoDecimal(
        modLeakageManualEntry.LeakageQty
      );
      this.createLeakageManualEntry(modLeakageManualEntry);
    } else {
      this.setState({ saveEnabled: true });
    }
  };

  validateSave(modLeakageManualEntry) {
    const validationErrors = lodash.cloneDeep(this.state.validationErrors);

    Object.keys(leakageManualEntryValidationDef).forEach((key) => {
      if (modLeakageManualEntry[key] !== undefined) {
        validationErrors[key] = Utilities.validateField(
          leakageManualEntryValidationDef[key],
          modLeakageManualEntry[key]
        );
      }
    });

    this.setState({ validationErrors });
    let returnValue = Object.values(validationErrors).every((value) => {
      return value === "";
    });
    return returnValue;
  }

  createLeakageManualEntry(modLeakageManualEntry) {
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      Entity: modLeakageManualEntry,
    };
    var notification = {
      messageType: "critical",
      message: "LeakageManualEntry_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["ProductCode"],
          keyValues: [modLeakageManualEntry.ProductCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateLeakageInfo,
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
          this.setState({ saveEnabled: false });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({ saveEnabled: true });
          console.log("Error in CreateLeakageManualEntry: ", result.ErrorList);
        }
        this.props.onSaved(modLeakageManualEntry, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnLeakageManualEntry
          ),
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modLeakageManualEntry, "add", notification);
      });
  }

  handleReset = () => {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      const leakageManualEntry = lodash.cloneDeep(
        this.state.leakageManualEntry
      );
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        modLeakageManualEntry: leakageManualEntry,
        validationErrors,
      });
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite: Error occurred on handleReset",
        error
      );
    }
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
        "LeakageManualEntryDetailsComposite: Error occurred on handleRouteSearchChange",
        error
      );
    }
  };

  getTankCodeSearchOptions() {
    let tankCodeSearchOptions = lodash.cloneDeep(
      this.state.tankCodeSearchOptions
    );
    let modTankCode = this.state.modLeakageManualEntry.TankCode;
    if (
      modTankCode !== null &&
      modTankCode !== "" &&
      modTankCode !== undefined
    ) {
      let selectedTankCode = tankCodeSearchOptions.find(
        (element) => element.value.toLowerCase() === modTankCode.toLowerCase()
      );
      if (selectedTankCode === undefined) {
        tankCodeSearchOptions.push({
          text: modTankCode,
          value: modTankCode,
        });
      }
    }
    return tankCodeSearchOptions;
  }

  handleMeterSearchChange = (meterCode) => {
    try {
      let meterCodeSearchOptions = this.state.meterCodeOptions.filter((item) =>
        item.value.toLowerCase().includes(meterCode.toLowerCase())
      );

      if (meterCodeSearchOptions.length > Constants.filteredOptionsCount) {
        meterCodeSearchOptions = meterCodeSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        meterCodeSearchOptions,
      });
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite: Error occurred on handleMeterSearchChange",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);
      const modLeakageManualEntry = lodash.cloneDeep(this.state.modLeakageManualEntry);
      validationErrors[propertyName] = error;
      modLeakageManualEntry[propertyName] = value;
      this.setState({ validationErrors, modLeakageManualEntry });
    } catch (error) {
      console.log(
        "LeakageManualEntryDetailsComposite: Error occurred on handleDateTextChange",
        error
      );
    }
  };

  getMeterCodeSearchOptions() {
    let meterCodeSearchOptions = lodash.cloneDeep(
      this.state.meterCodeSearchOptions
    );
    let modMeterCode = this.state.modLeakageManualEntry.MeterCode;
    if (
      modMeterCode !== null &&
      modMeterCode !== "" &&
      modMeterCode !== undefined
    ) {
      let selectedMeterCode = meterCodeSearchOptions.find(
        (element) => element.value.toLowerCase() === modMeterCode.toLowerCase()
      );
      if (selectedMeterCode === undefined) {
        meterCodeSearchOptions.push({
          text: modMeterCode,
          value: modMeterCode,
        });
      }
    }
    return meterCodeSearchOptions;
  }

  render() {
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <LeakageManualEntryDetails
            modLeakageManualEntry={this.state.modLeakageManualEntry}
            validationErrors={this.state.validationErrors}
            listOptions={{
              productCategory: this.state.productCategoryOptions,
              productCode: this.state.productCodeOptions,
              quantityUOM: this.state.quantityUOMOptions,
              densityUOM: this.state.densityUOMOptions,
              tankCode: this.getTankCodeSearchOptions(),
              meterCode: this.getMeterCodeSearchOptions(),
            }}
            onFieldChange={this.handleChange}
            onDateTextChange={this.handleDateTextChange}
            onTankSearchChange={this.handleTankSearchChange}
            onMeterSearchChange={this.handleMeterSearchChange}
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
)(LeakageManualEntryDetailsComposite);
