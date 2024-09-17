import React, { Component } from "react";
import { RailRouteDetails } from "../../UIBase/Details/RailRouteDetails";

import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { railRouteValidationDef } from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyRailRoute } from "../../../JS/DefaultEntities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import * as Constants from "./../../../JS/Constants";
import * as getUserDetails from "../../../Redux/Actions/GetUserDetails";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "./../../../Components/ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "./../../../JS/KeyCodes";
import lodash from "lodash";
import { functionGroups, fnRailRoute ,fnKPIInformation} from "../../../JS/FunctionGroups";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import { railRouteDestinationListDef } from "../../../JS/DetailsTableValidationDef";
import TMDetailsKPILayout from "../Common/TMDetailsKPILayout";
import { kpiRailRouteDetail } from "../../../JS/KPIPageName";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class RailRouteDetailsComposite extends Component {
  state = {
    railRoute: { ...emptyRailRoute },
    modRailRoute: {},
    modAssociations: [],
    validationErrors: Utilities.getInitialValidationErrors(
      railRouteValidationDef
    ),
    isReadyToRender: false,
    shareholders: this.getShareholders(),
    terminalCodes: [],
    customerDestinationOptions: {},
    saveEnabled: false,
    selectedRow: [],
    selectedAll: false,
    railRouteKPIList:[],
    showAuthenticationLayout: false,
    tempRailRoute: {},
  };

  getShareholders() {
    return Utilities.transferListtoOptions(
      this.props.userDetails.EntityResult.ShareholderList
    );
  }

  handleChange = (propertyName, data) => {
    try {
      let modRailRoute = { ...this.state.modRailRoute };
      modRailRoute[propertyName] = data;

      const validationErrors = { ...this.state.validationErrors };
      if (modRailRoute.Active === this.state.railRoute.Active) {
        if (
          this.state.railRoute.Remarks === modRailRoute.Remarks ||
          modRailRoute.Remarks === ""
        ) {
          validationErrors.Remarks = "";
        }
      }
      if (propertyName === "Active") {
        if (data !== this.state.railRoute.Active) {
          modRailRoute.Remarks = "";
        }
      }

      if (railRouteValidationDef[propertyName] !== undefined) {
        validationErrors[propertyName] = Utilities.validateField(
          railRouteValidationDef[propertyName],
          data
        );
      }
      this.setState({ validationErrors, modRailRoute });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  };

  handleshareholderChange = (shareholderList) => {
    try {
      this.getTerminalsList(shareholderList);
    } catch (error) {
      console.log(
        "RailRouteDetailsComposite:Error occured on handleshareholderChange",
        error
      );
    }
  };

  getTerminalsList(shareholderList) {
    try {
      if (
        shareholderList !== null &&
        shareholderList.length > 0 &&
        shareholderList[0] !== undefined &&
        shareholderList[0] !== ""
      ) {
        axios(
          RestAPIs.GetTerminals,
          Utilities.getAuthenticationObjectforPost(shareholderList)
        ).then((response) => {
          if (response.data.IsSuccess) {
            let railRoute = lodash.cloneDeep(this.state.railRoute);
            let modRailRoute = lodash.cloneDeep(this.state.modRailRoute);
            let terminalCodes = response.data.EntityResult;
            this.setState({ terminalCodes });
            if (
              railRoute.RouteCode === undefined ||
              railRoute.RouteCode === "" ||
              railRoute.RouteCode === null
            ) {
              if (terminalCodes.length === 1) {
                modRailRoute.TerminalCodes = [...terminalCodes];
              } else {
                modRailRoute.TerminalCodes = [];
              }
            }
            if (Array.isArray(modRailRoute.TerminalCodes)) {
              modRailRoute.TerminalCodes = terminalCodes.filter((x) =>
                modRailRoute.TerminalCodes.includes(x)
              );
            }
            this.setState(modRailRoute);
          }
        });
      } else {
        let modRailRoute = lodash.cloneDeep(this.state.modRailRoute);
        modRailRoute.TerminalCodes = [];
        let terminalCodes = [];
        this.setState({ modRailRoute, terminalCodes });
      }
    } catch (error) {
      console.log(
        "RailRouteDetailsComposite:Error occured on getTerminalsList",
        error
      );
    }
  }

  handleAllTerminalsChange = (checked) => {
    try {
      let modRailRoute = lodash.cloneDeep(this.state.modRailRoute);
      if (checked) modRailRoute.TerminalCodes = [...this.props.terminalCodes];
      else modRailRoute.TerminalCodes = [];
      this.setState({ modRailRoute });
    } catch (error) {
      console.log(
        "RailRouteDetailsComposite:Error occured on handleAllTerminasChange",
        error
      );
    }
  };

  handleAssociationSelectionChange = (e) => {
    this.setState({ selectedRow: e });
  };

  handleCellDataEdit = (newVal, cellData) => {
    let modAssociations = lodash.cloneDeep(this.state.modAssociations);

    if (cellData.field === "ShareholderCode") {
      let customerDestinationOptions = lodash.cloneDeep(
        this.state.customerDestinationOptions
      );
      if (
        customerDestinationOptions[
          modAssociations[cellData.rowIndex]["ShareholderCode"]
        ] !== undefined &&
        customerDestinationOptions[
          modAssociations[cellData.rowIndex]["ShareholderCode"]
        ] !== null
      ) {
        let destinationList = [];
        for (let customerCode in customerDestinationOptions[
          cellData.rowData["ShareholderCode"]
        ]) {
          customerDestinationOptions[cellData.rowData["ShareholderCode"]][
            customerCode
          ].forEach((destination) => {
            if (destinationList.indexOf(destination) === -1) {
              destinationList.push(destination);
            }
          });
        }
        if (destinationList !== undefined && destinationList.length === 1) {
          modAssociations[cellData.rowIndex]["DestinationCode"] =
            destinationList[0];
        } else {
          modAssociations[cellData.rowIndex]["DestinationCode"] = "";
        }
      }
    } else if (cellData.field === "Capacity") {
      if (isNaN(parseInt(newVal))) {
        newVal = "";
      } else {
        newVal = parseInt(newVal);
      }
    }
    modAssociations[cellData.rowIndex][cellData.field] = newVal;
    this.setState({ modAssociations });
  };

  handleAddAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        let newComp = {
          RouteCode: null,
          ShareholderCode: null,
          DestinationCode: null,
          ProductCode: null,
          SequenceNo: 0,
          Comments: "",
          AssociatedOrderItems: null,
          AssociatedContractItems: null,
          Attributes: [],
          RailWagonCode: null,
          SupplierCode: null,
          OriginTerminalCode: null,
        };
        let modAssociations = lodash.cloneDeep(this.state.modAssociations);
        newComp.ShareholderCode = this.props.selectedShareholder;
        newComp.SequenceNo = modAssociations.length + 1;
        modAssociations.push(newComp);

        this.setState({
          modAssociations,
          selectedRow: [],
        });
      } catch (error) {
        console.log(
          "RailRouteDetailsComposite:Error occured on handleAddAssociation",
          error
        );
      }
    }
  };

  handleDeleteAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedRow != null &&
          this.state.selectedRow.length > 0
        ) {
          if (this.state.modAssociations.length > 0) {
            let modAssociations = lodash.cloneDeep(this.state.modAssociations);

            this.state.selectedRow.forEach((obj, index) => {
              modAssociations = modAssociations.filter((com, cindex) => {
                return com.SequenceNo !== obj.SequenceNo;
              });
            });

            for (let i = 0; i < modAssociations.length; i++) {
              modAssociations[i].SequenceNo = i + 1;
            }

            this.setState({ modAssociations });
          }
        }

        this.setState({ selectedRow: [] });
      } catch (error) {
        console.log(
          "RailRouteDetailsComposite:Error occured on handleDeleteAssociation",
          error
        );
      }
    }
  };

  handleReset = () => {
    try {
      const { validationErrors } = { ...this.state };
      const railRoute = lodash.cloneDeep(this.state.railRoute);

      Object.keys(validationErrors).forEach(function (key) {
        validationErrors[key] = "";
      });
      this.setState({
        modRailRoute: { ...railRoute },
        modAssociations: this.getAssociationsFromRailRoute(railRoute),
        validationErrors,
      });
    } catch (error) {
      console.log(
        "RailDispatchDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  saveRailRoute = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempRailRoute = lodash.cloneDeep(this.state.tempRailRoute);

      this.state.railRoute.RouteCode === ""
      ? this.createRailRoute(tempRailRoute)
      : this.updateRailRoute(tempRailRoute);
    } catch (error) {
      console.log("RailRouteDetailssComposite : Error in saveRailRoute");
    }
  };

  handleSave = () => {
    try {
    //  this.setState({ saveEnabled: false });
      let modRailRoute = lodash.cloneDeep(this.state.modRailRoute);
      modRailRoute.IntermediateDestinationList = this.getCompartmentsFromAssociations(
        this.state.modAssociations
      );
      if (this.validateSave(modRailRoute)) {
        modRailRoute.DestinationCode =
          modRailRoute.IntermediateDestinationList[
            modRailRoute.IntermediateDestinationList.length - 1
          ].DestinationCode;
        modRailRoute.RouteName = modRailRoute.RouteCode;
      
        let showAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempRailRoute = lodash.cloneDeep(modRailRoute);
      this.setState({ showAuthenticationLayout, tempRailRoute }, () => {
        if (showAuthenticationLayout === false) {
          this.saveRailRoute();
        }
    });

        
      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "RailRouteDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  validateSave(modRailRoute) {
    let validationErrors = lodash.cloneDeep(this.state.validationErrors);

    Object.keys(railRouteValidationDef).forEach(function (key) {
      validationErrors[key] = Utilities.validateField(
        railRouteValidationDef[key],
        modRailRoute[key]
      );
    });

    if (modRailRoute.Active !== this.state.railRoute.Active) {
      if (modRailRoute.Remarks === null || modRailRoute.Remarks === "") {
        validationErrors["Remarks"] = "OriginTerminal_RemarksRequired";
      }
    }

    let notification = {
      messageType: "critical",
      message: "RailRouteDetails_SavedStatus",
      messageResultDetails: [],
    };

    let repeatDestination = "";
    let destinationList = [];
    for (let compart of modRailRoute.IntermediateDestinationList) {
      if (destinationList.indexOf(compart.DestinationCode) === -1) {
        destinationList.push(compart.DestinationCode);
      } else {
        repeatDestination = compart.DestinationCode;
        break;
      }
    }
    if (repeatDestination !== "") {
      notification.messageResultDetails.push({
        keyFields: [
          "RailRouteConfigurationDetails_RailRouteCode",
          "DestinationCode",
        ],
        keyValues: [modRailRoute.RouteCode, repeatDestination],
        isSuccess: false,
        errorMessage: "ERRMSG_RAILROUTE_DESTINATION_REPEATING_",
      });
      this.props.onSaved(this.state.modRailRoute, "update", notification);
      return false;
    }

    if (
      Array.isArray(modRailRoute.IntermediateDestinationList) &&
      modRailRoute.IntermediateDestinationList.length > 0
    ) {
      modRailRoute.IntermediateDestinationList.forEach((compart) => {
        railRouteDestinationListDef.forEach((col) => {
          let err = "";

          if (col.validator !== undefined) {
            err = Utilities.validateField(col.validator, compart[col.field]);
          }
          if (err !== "") {
            notification.messageResultDetails.push({
              keyFields: [
                "RailRouteConfigurationDetails_RailRouteCode",
                col.displayName,
              ],
              keyValues: [modRailRoute.RouteCode, compart[col.field]],
              isSuccess: false,
              errorMessage: err,
            });
          }
        });
      });
    } else {
      notification.messageResultDetails.push({
        keyFields: [],
        keyValues: [],
        isSuccess: false,
        errorMessage: "ERRMSG_RAILROUTE_DESTINATION_LIST_EMPTY",
      });
    }

    this.setState({ validationErrors });
    let returnValue = Object.values(validationErrors).every(function (value) {
      return value === "";
    });
    if (notification.messageResultDetails.length > 0) {
      this.props.onSaved(this.state.modRailRoute, "update", notification);
      return false;
    }
    return returnValue;
  }

  createRailRoute(modRailRoute) {
    let keyCode = [
      {
        key: KeyCodes.railRouteCode,
        value: modRailRoute.RouteCode,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railRouteCode,
      KeyCodes: keyCode,
      Entity: modRailRoute,
    };
    let notification = {
      messageType: "critical",
      message: "RailRouteDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailRouteConfigurationDetails_RailRouteCode"],
          keyValues: [modRailRoute.RouteCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.CreateRailRoute,
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
          this.setState({
            showAuthenticationLayout: false,
          });
          this.getRailRoute({ Common_Code: modRailRoute.RouteCode });
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: true,
            showAuthenticationLayout: false,
          });
          console.log("Error in CreateRailRoute:", result.ErrorList);
        }
        this.props.onSaved(modRailRoute, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: true,
          showAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modRailRoute, "add", notification);
      });
  }

  updateRailRoute(modRailRoute) {
    let keyCode = [
      {
        key: KeyCodes.railRouteCode,
        value: modRailRoute.RouteCode,
      },
    ];

    let obj = {
      ShareHolderCode: this.props.userDetails.EntityResult.PrimaryShareholder,
      keyDataCode: KeyCodes.railRouteCode,
      KeyCodes: keyCode,
      Entity: modRailRoute,
    };
    let notification = {
      messageType: "critical",
      message: "RailRouteDetails_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["RailRouteConfigurationDetails_RailRouteCode"],
          keyValues: [modRailRoute.RouteCode],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };

    axios(
      RestAPIs.UpdateRailRoute,
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
          this.setState({
            showAuthenticationLayout: false,
          });

          this.getRailRoute({ Common_Code: modRailRoute.RouteCode });
        } else {
          this.setState({
            saveEnabled: true,
            showAuthenticationLayout: false,
          });
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          console.log("Error in UpdateRailRoute:", result.ErrorList);
        }
        this.props.onSaved(modRailRoute, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modRailRoute, "modify", notification);
        this.setState({
          saveEnabled: true,
          showAuthenticationLayout: false,
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (
        this.state.railRoute.RouteCode !== "" &&
        nextProps.selectedRow.Common_Code === undefined
      )
        this.getRailRoute(nextProps.selectedRow);
    } catch (error) {
      console.log(
        "RailRouteDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getCustomerDestinations();
      this.getRailRoute(this.props.selectedRow);
    } catch (error) {
      console.log(
        "RailRouteDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  getCustomerDestinations() {
    axios(
      RestAPIs.GetCustomerDestinations +
        "?ShareholderCode=" +
        "&TransportationType=" +
        Constants.TransportationType.RAIL,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          if (Array.isArray(result.EntityResult)) {
            let customerDestinationOptions = {};
            result.EntityResult.forEach((entity) => {
              customerDestinationOptions[entity.ShareholderCode] =
                entity.CustomerDestinationsList;
            });
            this.setState({ customerDestinationOptions });
          } else {
            console.log("customerdestinations not identified for shareholder");
          }
        }
      })
      .catch((error) => {
        console.log("Error while getting Customer List:", error);
      });
  }

  getRailRoute(selectedRow) {
    let transportationType = this.getTransportationType();
    emptyRailRoute.TransportationType = transportationType;

    if (selectedRow.Common_Code === undefined) {
      this.setState({
        railRoute: { ...emptyRailRoute },
        modRailRoute: { ...emptyRailRoute },
        modAssociations: [],
        isReadyToRender: true,
        railRouteKPIList:[],
        saveEnabled: Utilities.isInFunction(
          this.props.userDetails.EntityResult.FunctionsList,
          functionGroups.add,
          fnRailRoute
        ),
      });
      return;
    }
    let keyCode = [
      {
        key: KeyCodes.railRouteCode,
        value: selectedRow.Common_Code,
      },
      {
        key: KeyCodes.transportationType,
        value: transportationType,
      },
    ];
    let obj = {
      ShareHolderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.railRouteCode,
      KeyCodes: keyCode,
    };
    axios(
      RestAPIs.GetRailRoute,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        if (result.IsSuccess === true) {
          this.getTerminalsList(
            transportationType === Constants.TransportationType.RAIL
              ? [result.EntityResult.ShareholderCode]
              : result.EntityResult.ShareholderCodes
          );
          this.setState({
            isReadyToRender: true,
            railRoute: lodash.cloneDeep(result.EntityResult),
            modRailRoute: lodash.cloneDeep(result.EntityResult),
            modAssociations: this.getAssociationsFromRailRoute(
              result.EntityResult
            ),
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnRailRoute
            ),
          });
          this.getKPIList(result.EntityResult.RailRouteCode);
        } else {
          this.setState({
            railRoute: lodash.cloneDeep(emptyRailRoute),
            modRailRoute: lodash.cloneDeep(emptyRailRoute),
            isReadyToRender: true,
          });
          console.log("Error in GetRailRoute:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting railRoute:", error);
      });
  }

  getTransportationType() {
    let transportationType = Constants.TransportationType.RAIL;
    const { genericProps } = this.props;
    if (
      genericProps !== undefined &&
      genericProps.transportationType !== undefined
    ) {
      transportationType = genericProps.transportationType;
    }
    return transportationType;
  }

  getAssociationsFromRailRoute(railRoute) {
    let railRouteAssociations = [];
    if (Array.isArray(railRoute.IntermediateDestinationList)) {
      railRoute.IntermediateDestinationList.forEach((destination) => {
        railRouteAssociations.push({
          SequenceNo: destination.SequenceNo,
          Remarks: destination.Remarks,
          DestinationCode: destination.DestinationCode,
          ShareholderCode: destination.ShareholderCode,
        });
      });
    }
    return railRouteAssociations;
  }

  getCompartmentsFromAssociations(modAssociations) {
    let railRouteDestinations = [];
    if (Array.isArray(modAssociations)) {
      modAssociations.forEach((modAssociation) => {
        if (
          !(
            modAssociation.DestinationCode === null ||
            modAssociation.DestinationCode === ""
          )
        ) {
          railRouteDestinations.push({
            SequenceNo: modAssociation.SequenceNo,
            Remarks: modAssociation.Remarks,
            DestinationCode: modAssociation.DestinationCode,
            ShareholderCode: modAssociation.ShareholderCode,
          });
        }
      });
    }
    return railRouteDestinations;
  }
  //Get KPI for Rail Route
  getKPIList(railRouteCode) {
    let KPIView = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.view,
      fnKPIInformation
    );
    if (KPIView === true) {
      let objKPIRequestData = {
        PageName: kpiRailRouteDetail,
        InputParameters: [{ key: "RailRouteCode", value:railRouteCode}],
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
              railRouteKPIList: result.EntityResult.ListKPIDetails,
            });
          } else {
            this.setState({ railRouteKPIList: [] });
            console.log("Error in rail route KPIList:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Rail Route KPIList:", error);
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
        fieldName: "RailRouteConfigurationList_LastUpdatedTime",
        fieldValue:
          new Date(
            this.state.modRailRoute.LastUpdatedTime
          ).toLocaleDateString() +
          " " +
          new Date(
            this.state.modRailRoute.LastUpdatedTime
          ).toLocaleTimeString(),
      },
      {
        fieldName: "RailRouteConfigurationDetails_LastActiveTime",
        fieldValue:
          this.state.modRailRoute.LastActiveTime !== undefined &&
          this.state.modRailRoute.LastActiveTime !== null
            ? new Date(
                this.state.modRailRoute.LastActiveTime
              ).toLocaleDateString() +
              " " +
              new Date(
                this.state.modRailRoute.LastActiveTime
              ).toLocaleTimeString()
            : "",
      },
      {
        fieldName: "RailRouteConfigurationDetails_CreatedTime",
        fieldValue:
          new Date(this.state.modRailRoute.CreatedTime).toLocaleDateString() +
          " " +
          new Date(this.state.modRailRoute.CreatedTime).toLocaleTimeString(),
      },
    ];
    return this.state.isReadyToRender ? (
      <div>
        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.railRoute.RouteCode}
            newEntityName="RailRouteConfigurationDetails_NewRailRoute"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <TMDetailsKPILayout KPIList={this.state.railRouteKPIList}> </TMDetailsKPILayout>
        <ErrorBoundary>
          <RailRouteDetails
            railRoute={this.state.railRoute}
            modRailRoute={this.state.modRailRoute}
            modAssociations={this.state.modAssociations}
            validationErrors={this.state.validationErrors}
            selectedRow={this.state.selectedRow}
            listOptions={{
              shareholders: this.state.shareholders,
              terminalCodes: this.props.terminalCodes,
              customerDestinationOptions: this.state.customerDestinationOptions,
            }}
            onFieldChange={this.handleChange}
            onAllTerminalsChange={this.handleAllTerminalsChange}
            handleAssociationSelectionChange={
              this.handleAssociationSelectionChange
            }
            handleCellDataEdit={this.handleCellDataEdit}
            handleAddAssociation={this.handleAddAssociation}
            handleDeleteAssociation={this.handleDeleteAssociation}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
          ></RailRouteDetails>
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
              this.state.railRoute.RouteCode  === ""
                ? functionGroups.add
                : functionGroups.modify
            }
            functionGroup={fnRailRoute}
            handleOperation={this.saveRailRoute}
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
)(RailRouteDetailsComposite);

RailRouteDetailsComposite.propTypes = {
  selectedRow: PropTypes.object.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  terminalCodes: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};
