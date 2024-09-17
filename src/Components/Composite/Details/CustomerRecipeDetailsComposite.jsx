import React, { Component } from "react";
import { CustomerRecipeDetails } from "../../UIBase/Details/CustomerRecipeDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { CustomerRecipeValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyCustomerRecipe } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { functionGroups, fnCustomerRecipe } from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import { CustomerRecipeAssociatedBPValidationDef } from "../../../JS/DetailsTableValidationDef";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";

class CustomerRecipeDetailsComposite extends Component {
  state = {
    CustomerRecipe: lodash.cloneDeep(emptyCustomerRecipe), //{ ...emptyCustomerRecipe },
    modCustomerRecipe: {},
    validationErrors: Utilities.getInitialValidationErrors(
      CustomerRecipeValidationDef
    ),
    isReadyToRender: false,
    saveEnabled: false,
    customerKPIList: [],
    Customers: [],
    terminalCodes: this.props.userDetails.EntityResult.IsEnterpriseNode
      ? this.getTerminalList()
      : [],
    finishedProducts: [],
    showAuthenticationLayout: false,
  };

  handleChange = (propertyName, data) => {
    try {
      const modCustomerRecipe = lodash.cloneDeep(this.state.modCustomerRecipe);
      const validationErrors = lodash.cloneDeep(this.state.validationErrors);

      modCustomerRecipe[propertyName] = data;
      this.setState({ modCustomerRecipe });
      if (CustomerRecipeValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          CustomerRecipeValidationDef[propertyName],
          data
        );
        this.setState({ validationErrors });
      }

      if (CustomerRecipeValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          CustomerRecipeValidationDef[propertyName],
          data
        );
      }

      this.setState({ modCustomerRecipe, validationErrors });
    } catch (error) {
      console.log(
        "CustomerRecipeDetailsComposite:Error occured on handleChange",
        error
      );
    }
  };

  handleTerminalChange = (value) => {
    this.getFinishedProductList(value);
    this.getcustomerList(value);
  };

  handleFinishedProductChange = (value) => {
    try {
      let modCustomerRecipe = lodash.cloneDeep(this.state.modCustomerRecipe);
      modCustomerRecipe.FinishedProduct.Code = value;
      this.getFinishedProduct(value, this.props.selectedShareholder);
      this.setState({ modCustomerRecipe });
    } catch (error) {
      console.log(error);
    }
  };

  handleActiveStatusChange = (value) => {
    try {
      let modCustomerRecipe = lodash.cloneDeep(this.state.modCustomerRecipe);
      modCustomerRecipe.Status = value;
      if (modCustomerRecipe.Status !== this.state.CustomerRecipe.Status)
        modCustomerRecipe.Remarks = "";
      this.setState({ modCustomerRecipe });
    } catch (error) {
      console.log(error);
    }
  };

  getFinishedProduct(finishedProductCode, shareHolderCode) {
    var keyCode = [
      {
        key: KeyCodes.finishedProductCode,
        value: finishedProductCode,
      },
    ];
    var obj = {
      ShareHolderCode: shareHolderCode,
      keyDataCode: KeyCodes.finishedProductCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetFinishedProduct,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        const result = response.data;
        const modCustomerRecipe = lodash.cloneDeep(
          this.state.modCustomerRecipe
        );
        if (result.IsSuccess) {
          if (
            Array.isArray(result.EntityResult.FinishedProductItems) &&
            result.EntityResult.FinishedProductItems.length > 0
          ) {
            modCustomerRecipe.FinishedProduct.FinishedProductItems =
              result.EntityResult.FinishedProductItems;
            this.setState({
              modCustomerRecipe: modCustomerRecipe,
            });
          }
        } else {
          console.log("Error in getFinishedProduct:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Finished Product:", error);
      });
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.CustomerRecipe.Code !== "" &&
        nextProps.selectedRow.CustomerRecipe_Code === undefined &&
        this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      ) {
        this.getCustomerRecipe(nextProps.selectedRow);
      }
    } catch (error) {
      console.log(
        "CustomerRecipeDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getCustomerRecipe(this.props.selectedRow);
    } catch (error) {
      console.log(
        "CustomerRecipeDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getTerminalList() {
    return this.props.terminalList;
  }

  getFinishedProductList(terminalCode) {
    this.setState({ finishedProducts: [] });
    axios(
      RestAPIs.GetFinishedProductCodes +
        "?ShareholderCode=" +
        this.props.selectedShareholder +
        "&TerminalCode=" +
        terminalCode,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    ).then((response) => {
      var result = response.data;
      if (result.IsSuccess === true) {
        if (
          Array.isArray(result.EntityResult) &&
          result.EntityResult.length > 0
        ) {
          let finishedProductOptions = Utilities.transferListtoOptions(
            result.EntityResult
          );
          this.setState({ finishedProducts: finishedProductOptions });
        }
      }
    });
  }

  getcustomerList(terminalCode) {
    this.setState({ Customers: [] });
    axios(
      RestAPIs.GetCustomerListForRole +
        "?ShareholderCode=" +
        this.props.selectedShareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        let isEnterprise = this.props.userDetails.EntityResult.IsEnterpriseNode;
        if (result.IsSuccess === true) {
          let Customercodes = [];
          result.EntityResult.Table.forEach((ele) => {
            if (isEnterprise && ele.TerminalCodes.indexOf(terminalCode) > -1) {
              Customercodes.push(ele.Common_Code);
            } else if (!isEnterprise) {
              Customercodes.push(ele.Common_Code);
            }
          });

          let Customers = Utilities.transferListtoOptions(Customercodes);

          this.setState({ Customers, isReadyToRender: true });
        } else {
          this.setState({ Customers: [], isReadyToRender: true });
          console.log("Error in GetCustomerListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        this.setState({ Customers: [], isReadyToRender: true });
        console.log("Error while getting Customer List:", error);
      });
  }

  initialFPAndCustomer(terminalCode) {
    this.getFinishedProductList(terminalCode);
    this.getcustomerList(terminalCode);
  }

  getCustomerRecipe(selectedRow) {
    let TerminalCode = this.props.userDetails.EntityResult.IsEnterpriseNode
      ? selectedRow.TerminalCode
      : this.props.userDetails.EntityResult.TerminalCode;
    emptyCustomerRecipe.ShareholderCode = this.props.selectedShareholder;

    if (selectedRow.CustomerRecipe_Code === undefined) {
      if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
        this.initialFPAndCustomer(TerminalCode);
      }
      this.setState({
        CustomerRecipe: lodash.cloneDeep(emptyCustomerRecipe),
        modCustomerRecipe: lodash.cloneDeep(emptyCustomerRecipe),
        isReadyToRender: true,
        customerKPIList: [],
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnCustomerRecipe
        ),
      });
      return;
    }

    var keyCode = [
      {
        key: KeyCodes.CustomerRecipeCode,
        value: selectedRow.CustomerRecipe_Code,
      },
      {
        key: KeyCodes.terminalCode,
        value: TerminalCode,
      },
      {
        key: KeyCodes.finishedProductCode,
        value: selectedRow.FinishedProduct_Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.CustomerRecipeCode,
      KeyCodes: keyCode,
    };

    axios(
      RestAPIs.GetCustomerRecipe,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let results = lodash.cloneDeep(result.EntityResult);
          this.initialFPAndCustomer(results.TerminalCode);
          this.setState({
            isReadyToRender: true,
            CustomerRecipe: results,
            modCustomerRecipe: results,
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCustomerRecipe
            ),
          });
        } else {
          this.setState({
            CustomerRecipe: lodash.cloneDeep(emptyCustomerRecipe),
            modCustomerRecipe: lodash.cloneDeep(emptyCustomerRecipe),
            isReadyToRender: true,
          });
          console.log("Error in GetCustomer:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Customer:", error, selectedRow);
      });
  }

  validateSave(modCustomerRecipe) {
    var validationErrors = lodash.cloneDeep(this.state.validationErrors);
    Object.keys(CustomerRecipeValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        CustomerRecipeValidationDef[key],
        modCustomerRecipe[key]
      );
    });

    if (modCustomerRecipe.Status !== this.state.CustomerRecipe.Status) {
      if (
        modCustomerRecipe.Remarks === null ||
        modCustomerRecipe.Remarks === ""
      ) {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }

    if (
      modCustomerRecipe.FinishedProduct.Code === "" ||
      modCustomerRecipe.FinishedProduct.Code === undefined ||
      modCustomerRecipe.FinishedProduct.Code === null
    ) {
      validationErrors.CustomerRecipefinishedProducts =
        "CustomerRecipeDetails_reqFinishedProduct";
    } else {
      validationErrors.CustomerRecipefinishedProducts = "";
    }

    if (!this.props.userDetails.EntityResult.IsEnterpriseNode) {
      validationErrors.TerminalCode = "";
    }

    var returnValue = true;
    returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    this.setState({ validationErrors });

    let notification = {
      messageType: "critical",
      message: "CUSTOMERRECIPE_SavedStatus",
      messageResultDetails: [],
    };

    if (modCustomerRecipe.FinishedProduct.FinishedProductItems.length > 0) {
      modCustomerRecipe.FinishedProduct.FinishedProductItems.forEach((com) => {
        let err = "";

        if (
          CustomerRecipeAssociatedBPValidationDef[0].validator !== undefined
        ) {
          err = Utilities.validateField(
            CustomerRecipeAssociatedBPValidationDef[0].validator,
            com["Quantity"]
          );
        }

        if (err !== "") {
          notification.messageResultDetails.push({
            keyFields: [CustomerRecipeAssociatedBPValidationDef[0].displayName],
            keyValues: [com[CustomerRecipeAssociatedBPValidationDef[0].field]],
            isSuccess: false,
            errorMessage: err,
          });
        }
      });
    }

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
  }

  saveCustomerRecipe = () => {
    try {
      this.setState({ saveEnabled: false });
      let CustomerRecipe = lodash.cloneDeep(this.state.CustomerRecipe);
      let modCustomerRecipe = lodash.cloneDeep(this.state.modCustomerRecipe);
      CustomerRecipe.Code === ""
        ? this.createCustomerRecipe(modCustomerRecipe)
        : this.updateCustomerRecipe(modCustomerRecipe);
    } catch (error) {
      console.log(
        "CustomerRecipeDetailsComposite : Error in saveCustomerRecipe"
      );
    }
  };
  handleSave = () => {
    try {
      let modCustomerRecipe = lodash.cloneDeep(this.state.modCustomerRecipe);
      if (this.validateSave(modCustomerRecipe)) {
        let showAuthenticationLayout =
          this.props.userDetails.EntityResult.IsWebPortalUser !== true
            ? true
            : false;
        this.setState({ showAuthenticationLayout }, () => {
          if (showAuthenticationLayout === false) {
            this.saveCustomerRecipe();
          }
        });
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "CustomerRecipeDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  convertStringtoDecimal(modFinishedProduct) {
    try {
      if (
        modFinishedProduct.Density !== null &&
        modFinishedProduct.Density !== ""
      ) {
        modFinishedProduct.Density = Utilities.convertStringtoDecimal(
          modFinishedProduct.Density
        );
      }
      if (
        modFinishedProduct.ToleranceQuantity !== null &&
        modFinishedProduct.ToleranceQuantity !== ""
      ) {
        modFinishedProduct.ToleranceQuantity = Utilities.convertStringtoDecimal(
          modFinishedProduct.ToleranceQuantity
        );
      }
      if (
        modFinishedProduct.ToleranceQuantityForMarine !== null &&
        modFinishedProduct.ToleranceQuantityForMarine !== ""
      ) {
        modFinishedProduct.ToleranceQuantityForMarine =
          Utilities.convertStringtoDecimal(
            modFinishedProduct.ToleranceQuantityForMarine
          );
      }
      if (
        modFinishedProduct.ToleranceQuantityForPipeline !== null &&
        modFinishedProduct.ToleranceQuantityForPipeline !== ""
      ) {
        modFinishedProduct.ToleranceQuantityForPipeline =
          Utilities.convertStringtoDecimal(
            modFinishedProduct.ToleranceQuantityForPipeline
          );
      }
      if (
        modFinishedProduct.ToleranceQuantityForRail !== null &&
        modFinishedProduct.ToleranceQuantityForRail !== ""
      ) {
        modFinishedProduct.ToleranceQuantityForRail =
          Utilities.convertStringtoDecimal(
            modFinishedProduct.ToleranceQuantityForRail
          );
      }

      if (this.state.hazardousEnabled) {
        if (
          modFinishedProduct.SFLPercent !== null &&
          modFinishedProduct.SFLPercent !== ""
        ) {
          modFinishedProduct.SFLPercent = Utilities.convertStringtoDecimal(
            modFinishedProduct.SFLPercent
          );
        }
      }
      return modFinishedProduct;
    } catch (err) {
      console.log("convertStringtoDecimal error finishedProduct details", err);
    }
  }

  createCustomerRecipe(modCustomerRecipe) {
    modCustomerRecipe.FinishedProduct = this.convertStringtoDecimal(
      modCustomerRecipe.FinishedProduct
    );

    var keyCode = [
      {
        key: KeyCodes.CustomerRecipeCode,
        value: modCustomerRecipe.Code,
      },
    ];
    var obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.CustomerRecipeCode,
      KeyCodes: keyCode,
      Entity: modCustomerRecipe,
    };

    var notification = {
      messageType: "critical",
      message: "CustomerRecipeDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["CustomerRecipe_Code"],
          keyValues: [modCustomerRecipe.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateCustomerRecipe,
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
                fnCustomerRecipe
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getCustomerRecipe({
                CustomerRecipe_Code: modCustomerRecipe.Code,
                FinishedProduct_Code: modCustomerRecipe.FinishedProduct.Code,
                TerminalCode: modCustomerRecipe.TerminalCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnCustomerRecipe
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in CreateCustomer:", result.ErrorList);
        }
        this.props.onSaved(modCustomerRecipe, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnCustomerRecipe
          ),
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCustomerRecipe, "add", notification);
      });
  }

  updateCustomerRecipe(modCustomerRecipe) {
    let keyCode = [
      {
        key: KeyCodes.CustomerRecipeCode,
        value: modCustomerRecipe.Code,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.CustomerRecipeCode,
      KeyCodes: keyCode,
      Entity: modCustomerRecipe,
    };

    let notification = {
      messageType: "critical",
      message: "CustomerRecipeDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["CustomerRecipe_Code"],
          keyValues: [modCustomerRecipe.Code],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateCustomerRecipe,
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
                fnCustomerRecipe
              ),
              showAuthenticationLayout: false,
            },
            () =>
              this.getCustomerRecipe({
                CustomerRecipe_Code: modCustomerRecipe.Code,
                FinishedProduct_Code: modCustomerRecipe.FinishedProduct.Code,
                TerminalCode: modCustomerRecipe.TerminalCode,
              })
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnCustomerRecipe
            ),
            showAuthenticationLayout: false,
          });
          console.log("Error in UpdateCustomerRecipe:", result.ErrorList);
        }
        this.props.onSaved(modCustomerRecipe, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modCustomerRecipe, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnCustomerRecipe
          ),
          showAuthenticationLayout: false,
        });
      });
  }

  handleReset = () => {
    try {
      const validationErrors = { ...this.state.validationErrors };
      const CustomerRecipe = lodash.cloneDeep(this.state.CustomerRecipe);
      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        modCustomerRecipe: { ...CustomerRecipe },
        validationErrors,
      });
      if (this.state.CustomerRecipe.Code === "") {
        var terminalCodes = [...this.state.terminalCodes];
        terminalCodes = [];
        this.setState({ terminalCodes });
      }
    } catch (error) {
      console.log(
        "CustomerRecipeDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modCustomerRecipe = lodash.cloneDeep(this.state.modCustomerRecipe);
    modCustomerRecipe.FinishedProduct.FinishedProductItems[cellData.rowIndex][
      cellData.field
    ] = newVal;
    this.setState({ modCustomerRecipe });
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAuthenticationLayout: false,
    });
  };

  render() {
    const popUpContents = [
      {
        fieldName: "Cust_LastUpDt",
        fieldValue:
          new Date(
            this.state.modCustomerRecipe.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modCustomerRecipe.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "Cust_CreateDt",
        fieldValue:
          new Date(
            this.state.modCustomerRecipe.CreatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modCustomerRecipe.CreatedTime
          ).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.CustomerRecipe.Code}
            newEntityName="CustomerRecipe_Title"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>

        <ErrorBoundary>
          <CustomerRecipeDetails
            CustomerRecipe={this.state.CustomerRecipe}
            modCustomerRecipe={this.state.modCustomerRecipe}
            validationErrors={this.state.validationErrors}
            Customers={this.state.Customers}
            terminalCodes={this.state.terminalCodes}
            finishedProducts={this.state.finishedProducts}
            onFieldChange={this.handleChange}
            handleFinishedProductChange={this.handleFinishedProductChange}
            handleActiveStatusChange={this.handleActiveStatusChange}
            handleTerminalChange={this.handleTerminalChange}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            handleCellDataEdit={this.handleCellDataEdit}
          ></CustomerRecipeDetails>
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
              this.state.CustomerRecipe.Code === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnCustomerRecipe}
            handleOperation={this.saveCustomerRecipe}
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

export default connect(mapStateToProps)(CustomerRecipeDetailsComposite);

CustomerRecipeDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  genericProps: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  activeItem: PropTypes.object,
};
