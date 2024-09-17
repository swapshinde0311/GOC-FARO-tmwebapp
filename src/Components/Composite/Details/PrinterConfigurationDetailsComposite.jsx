import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { PrinterConfigurationDetails } from "../../UIBase/Details/PrinterConfigurationDetails";
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import {
    functionGroups,
    fnPrinterConfiguration
} from "../../../JS/FunctionGroups";
import { TranslationConsumer } from "@scuf/localization";
import {
    PrinterConfigurationValidationDef,
} from "../../../JS/ValidationDef";
import UserAuthenticationLayout from "../Common/UserAuthentication";

class PrinterConfigurationDetailsComposite extends Component {
    state = {
        locationOptions: [],
        modlocationOptions: [],
        printerOptions: [],
        allPrinterOptions: [],
        allAvailableReports: [],
        locationPrinterConfig: [],
        backUpPrinterConfig: [],
        modLocationPrinterConfig: [],
        modBackUpPrinterConfig: [],
        isReadyToRender: false,
        activeTab: 0,
        reportPrinterConfig: { locationCode: null, printerName: null, selectedReports: [] },
        modReportPrinterConfig: { locationCode: null, printerName: null, selectedReports: [] },
        modLocationCode: null,
        modPrinterName: null,
        saveEnabled: false,
        validationErrors: Utilities.getInitialValidationErrors(
            PrinterConfigurationValidationDef
        ),
        selectedReports: [],
        selectedBackupPrinters: [],
        tab1_LocationCode: null,
        showAuthenticationLayout: false,
    }

    componentDidMount() {
        try {
            Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
            this.setState({
                saveEnabled: Utilities.isInFunction(
                    this.props.userDetails.EntityResult.FunctionsList,
                    functionGroups.add,
                    fnPrinterConfiguration
                )
            })
            this.GetAllLocationsForPrinterConfig();
            this.GetAllAvailableReports();
        } catch (error) {
            console.log(
                "PrinterConfigurationDetailsComposite:Error occured on componentDidMount",
                error
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        try {
            if (this.state.activeTab == 0) {
                if (
                    this.state.reportPrinterConfig.locationCode !== null &&
                    nextProps.selectedRow.LocationCode === undefined &&
                    this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
                ) {
                    let reportPrinterConfig = { locationCode: null, printerName: null, selectedReports: [] }
                    this.setState({
                        reportPrinterConfig,
                        modReportPrinterConfig: reportPrinterConfig,
                        printerOptions: [],
                        tab1_LocationCode: null,
                        activeTab: 0
                    }, () => {

                        this.GetAllLocationsForPrinterConfig();
                    })
                }
            }
            else {
                if (
                    nextProps.selectedRow.LocationCode === undefined &&
                    this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
                ) {
                    let reportPrinterConfig = { locationCode: null, printerName: null, selectedReports: [] }
                    this.setState({
                        reportPrinterConfig,
                        modReportPrinterConfig: reportPrinterConfig,
                        printerOptions: [],
                        tab1_LocationCode: null,
                        activeTab: 0
                    }, () => {
                        this.GetAllLocationsForPrinterConfig()
                    })

                }
            }
        } catch (error) {
            console.log(
                "PrinterConfigurationDetailsComposite:Error occured on componentWillReceiveProps",
                error
            );
        }
    }

    GetAllLocationsForPrinterConfig() {
        try {
            axios(
                RestAPIs.GetAllLocationsForPrinterConfig,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (this.props.selectedRow.LocationCode !== undefined &&
                            this.props.selectedRow.LocationCode !== null &&
                            this.props.selectedRow.LocationCode !== "") {
                            let reportPrinterConfig = lodash.cloneDeep(this.state.reportPrinterConfig)
                            reportPrinterConfig.locationCode = this.props.selectedRow.LocationCode;
                            this.setState({
                                locationOptions: result.EntityResult,
                                modlocationOptions: result.EntityResult,
                                isReadyToRender: true,
                                reportPrinterConfig,
                                modReportPrinterConfig: reportPrinterConfig
                            }, () => {
                                this.GetLocationPrinterConfig();
                                this.GetPrintersForLocation(this.props.selectedRow.LocationCode, this.props.selectedRow.PrinterName)
                            });
                        }

                        else
                            this.setState({
                                locationOptions: result.EntityResult,
                                modlocationOptions: result.EntityResult,
                                isReadyToRender: true
                            }, () => {
                                this.GetLocationPrinterConfig();
                            })
                    } else {
                        this.setState({
                            locationOptions: [],
                            modlocationOptions: [],
                            isReadyToRender: true
                        });
                        console.log("Error in getLocations List:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({
                        locationOptions: [],
                        modlocationOptions: [],
                        isReadyToRender: true
                    });
                    console.log("Error while getting locations List:", error);
                });
        }
        catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error while getting Locations List:", error);
        }
    }

    GetAllPrinters() {
        try {
            axios(
                RestAPIs.GetAllPrinters,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        this.setState({ allPrinterOptions: result.EntityResult, isReadyToRender: true });
                    } else {
                        this.setState({ allPrinterOptions: [], isReadyToRender: true });
                        console.log("Error in getallPrinter List:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({ allPrinterOptions: [], isReadyToRender: true });
                    console.log("Error while getting all Printers List:", error);
                });
        }
        catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error while getting all Printer List:", error);
        }
    }

    GetAllAvailableReports() {
        try {
            axios(
                RestAPIs.GetAllAvailableReports,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        let allAvailableReports = [];
                        if (Array.isArray(result.EntityResult))
                            result.EntityResult.forEach((item) => {
                                allAvailableReports.push(
                                    {
                                        ReportName: item
                                    }
                                )
                            })

                        this.setState({ allAvailableReports, isReadyToRender: true });
                    } else {
                        this.setState({ allAvailableReports: [], isReadyToRender: true });
                        console.log("Error in getallAvailableReports List:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({ allAvailableReports: [], isReadyToRender: true });
                    console.log("Error while getting all reports List:", error);
                });
        }
        catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error while getting all reports List:", error);
        }
    }

    GetAssociatedReports(locationCode, printerName) {
        try {
            let modReportPrinterConfig = lodash.cloneDeep(this.state.modReportPrinterConfig)
            axios(
                RestAPIs.GetAssociatedReports + "?locationCode=" + locationCode
                + "&printerName=" + printerName,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        let selectedReports = [];
                        if (Array.isArray(result.EntityResult))
                            result.EntityResult.forEach((item) => {
                                selectedReports.push(
                                    {
                                        ReportName: item
                                    }
                                )
                            })
                        modReportPrinterConfig.selectedReports = selectedReports
                        let reportPrinterConfig = lodash.cloneDeep(this.state.reportPrinterConfig)
                        if (reportPrinterConfig.locationCode !== null &&
                            reportPrinterConfig.locationCode !== undefined &&
                            reportPrinterConfig.locationCode !== "")
                            this.setState({
                                reportPrinterConfig: modReportPrinterConfig,
                                modReportPrinterConfig,
                                isReadyToRender: true
                            });
                        else {
                            this.setState({
                                modReportPrinterConfig,
                                isReadyToRender: true
                            });
                        }
                    } else {
                        modReportPrinterConfig.selectedReports = []
                        this.setState({
                            modReportPrinterConfig,
                            isReadyToRender: true
                        });
                        console.log("Error in getAssociatedReports for location and printer Name:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    modReportPrinterConfig.selectedReports = []
                    this.setState({
                        modReportPrinterConfig,
                        isReadyToRender: true
                    });
                    console.log("Error while getting associated reports for location List:", error);
                });
        }
        catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error while getting Printers for location List:", error);
        }
    }

    GetPrintersForLocation(locationCode, printerName) {
        try {
            axios(
                RestAPIs.GetPrintersForLocation + "?locationCode=" + locationCode,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        if (printerName !== null &&
                            printerName !== undefined &&
                            printerName !== "") {
                            let reportPrinterConfig = lodash.cloneDeep(this.state.reportPrinterConfig)
                            reportPrinterConfig.printerName = printerName
                            this.setState({
                                printerOptions: result.EntityResult,
                                isReadyToRender: true,
                                reportPrinterConfig,
                                modReportPrinterConfig: reportPrinterConfig
                            }, () => {
                                this.GetAssociatedReports(locationCode, printerName)
                            });
                        }

                        else
                            this.setState({
                                printerOptions: result.EntityResult,
                                isReadyToRender: true
                            });
                    } else {
                        this.setState({
                            printerOptions: [],
                            isReadyToRender: true
                        });
                        console.log("Error in getPrinters for location List:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({
                        printerOptions: [],
                        isReadyToRender: true
                    });
                    console.log("Error while getting Printers for location List:", error);
                });
        }
        catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error while getting Printers for location List:", error);
        }
    }

    GetLocationPrinterConfig() {
        try {
            axios(
                RestAPIs.GetLocationPrinterConfig,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {
                    var result = response.data;
                    if (result.IsSuccess === true) {
                        let locationPrinterConfig = result.EntityResult.LocationPrinterConfigList;
                        let backUpPrinterConfig = result.EntityResult.BackupPrinterInfoList;

                        let modlocationOptions = lodash.cloneDeep(this.state.locationOptions);

                        modlocationOptions = modlocationOptions.filter(item => {
                            let index = locationPrinterConfig.findIndex((x) => x.Location === item)
                            return index !== -1 && locationPrinterConfig[index].Printer !== ""
                        })

                        backUpPrinterConfig =
                            Utilities.addSeqNumberToListObject(backUpPrinterConfig);

                        this.setState({
                            locationPrinterConfig,
                            backUpPrinterConfig,
                            modLocationPrinterConfig: locationPrinterConfig,
                            modBackUpPrinterConfig: backUpPrinterConfig,
                            isReadyToRender: true,
                            modlocationOptions
                        });
                    } else {
                        this.setState({
                            locationPrinterConfig: [],
                            backUpPrinterConfig: [],
                            modLocationPrinterConfig: [],
                            modBackUpPrinterConfig: [],
                            isReadyToRender: true
                        });
                        console.log("Error in getLocationPrinterConfig List:", result.ErrorList);
                    }
                })
                .catch((error) => {
                    this.setState({
                        locationPrinterConfig: [],
                        backUpPrinterConfig: [],
                        modLocationPrinterConfig: [],
                        modBackUpPrinterConfig: [],
                        isReadyToRender: true
                    });
                    console.log("Error while getting LocationPrinterConfig List:", error);
                });
        }
        catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error while getting Printer List:", error);
        }
    }

    handleReportsSelectionChange = (items) => {
        try {
            let modReportPrinterConfig = lodash.cloneDeep(this.state.modReportPrinterConfig)
            modReportPrinterConfig.selectedReports = items
            this.setState({ modReportPrinterConfig });
        } catch (error) {
            console.log(
                "PrinterConfigurationDetailsComposite:Error occured on handleReportsSelectionChange",
                error
            );
        }
    };

    handleBackUpPrinterSelectionChange = (items) => {
        try {
            this.setState({ selectedBackupPrinters: items });
        } catch (error) {
            console.log(
                "PrinterConfigurationDetailsComposite:Error occured on handleBackUpPrinterSelectionChange",
                error
            );
        }
    };

    UpdateReportPrinterConfig = () => {
        this.handleAuthenticationClose();
        let selectedReportsList = lodash.cloneDeep(this.state.modReportPrinterConfig.selectedReports)
        let reportsList = [];
        if (Array.isArray(selectedReportsList)) {
            selectedReportsList.forEach(element => {
                reportsList.push(element.ReportName)
        });
        }

        let locationCode=this.state.modReportPrinterConfig.locationCode;
        let printerName= this.state.modReportPrinterConfig.printerName;

        var keyCode = [
            {
                key: KeyCodes.locationCode,
                value: locationCode,
            },
            {
                key: KeyCodes.printerName,
                value: printerName,
            }
        ];
        var obj = {
            ShareHolderCode: "",
            keyDataCode: KeyCodes.locationCode,
            KeyCodes: keyCode,
            Entity: reportsList
        };
        let notification = {
            messageType: "critical",
            message: "ReportPrinterConfig_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: ["PrinterConfig_LocationCode"],
                    keyValues: [locationCode],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };
        axios(
            RestAPIs.UpdateReportPrinterConfig,
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
                    let reportPrinterConfig = lodash.cloneDeep(this.state.reportPrinterConfig);
                    reportPrinterConfig.locationCode = locationCode;
                    reportPrinterConfig.printerName = printerName;
                    this.setState({
                        reportPrinterConfig,
                        modReportPrinterConfig: reportPrinterConfig,
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnPrinterConfiguration
                        )
                    }, () => {
                        this.GetPrintersForLocation(locationCode, printerName)
                    })
                } else {
                    this.setState({ isReadyToRender: true });
                    notification.messageResultDetails[0].errorMessage = result.ResultDataList[0].ErrorList[0];
                }
                this.props.onSaved(this.state.modReportPrinterConfig, "add", notification);

            })
            .catch((error) => {
                console.log("Error while UpdateReportPrinterConfig:", error);
            });

    }

    UpdateLocationPrinterConfig() {
        this.handleAuthenticationClose();
        let printersList = lodash.cloneDeep(this.state.printerOptions)
        let locationCode=this.state.tab1_LocationCode;

        var keyCode = [
            {
                key: KeyCodes.locationCode,
                value: locationCode,
            }
        ];
        var obj = {
            ShareHolderCode: "",
            keyDataCode: KeyCodes.locationCode,
            KeyCodes: keyCode,
            Entity: printersList
        };
        let notification = {
            messageType: "critical",
            message: "LocationPrinterConfig_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: ["PrinterConfig_LocationCode"],
                    keyValues: [locationCode],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };
        axios(
            RestAPIs.UpdateLocationPrinterConfig,
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
                    this.setState({
                        tab1_LocationCode: locationCode,
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnPrinterConfiguration
                        )
                    }, () => {
                        this.GetLocationPrinterConfig()
                        this.GetPrintersForLocation(locationCode, null)
                    })
                } else {
                    this.setState({
                        isReadyToRender: true,
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnPrinterConfiguration
                        )
                    });
                    notification.messageResultDetails[0].errorMessage = result.ErrorList[0];
                }
                this.props.onSaved("", "", notification);
            })
            .catch((error) => {
                console.log("Error while UpdateLocationPrinterConfig:", error);
                this.setState({
                    isReadyToRender: true,
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnPrinterConfiguration
                    )
                });
            });

    }

    UpdateBackUpPrinterConfig() {
        this.handleAuthenticationClose();
        let backUpPrinterConfig = lodash.cloneDeep(this.state.modBackUpPrinterConfig)
        var obj = {
            ShareHolderCode: "",
            keyDataCode: KeyCodes.locationCode,
            KeyCodes: [],
            Entity: backUpPrinterConfig
        };
        let notification = {
            messageType: "critical",
            message: "BackUPPrinterConfig_SavedStatus",
            messageResultDetails: [
                {
                    keyFields: [],
                    keyValues: [],
                    isSuccess: false,
                    errorMessage: "",
                },
            ],
        };
        axios(
            RestAPIs.UpdateBackUpPrinterConfig,
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
                    this.setState({
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnPrinterConfiguration
                        )
                    }, () => {
                        this.GetLocationPrinterConfig()
                    })
                } else {

                    this.setState({
                        isReadyToRender: true,
                        saveEnabled: Utilities.isInFunction(
                            this.props.userDetails.EntityResult.FunctionsList,
                            functionGroups.add,
                            fnPrinterConfiguration
                        )
                    });

                    notification.messageResultDetails[0].errorMessage = result.ErrorList[0];
                }
                this.props.onSaved("", "", notification);

            })
            .catch((error) => {
                console.log("Error while UpdateBackUpPrinterConfig:", error);
                this.setState({
                    isReadyToRender: true,
                    saveEnabled: Utilities.isInFunction(
                        this.props.userDetails.EntityResult.FunctionsList,
                        functionGroups.add,
                        fnPrinterConfiguration
                    )
                });
            });

    }

        
    handleUpdateReportPrinterConfig = () => {
        try {
          this.setState({ saveEnabled: false });
         
          this.UpdateReportPrinterConfig();

        } catch (error) {
          console.log("Save Scada Config Composite : Error in saveScadaConfig");
        }
      };

      handleUpdateLocationPrinterConfig = () => {
        try {
          this.setState({ saveEnabled: false });
         
          this.UpdateLocationPrinterConfig();

        } catch (error) {
          console.log("Save Scada Config Composite : Error in saveScadaConfig");
        }
      };


      handleUpdateBackupPrinterConfig = () => {
        try {
          this.setState({ saveEnabled: false });
         
          this.UpdateBackUpPrinterConfig();

        } catch (error) {
          console.log("Save Scada Config Composite : Error in saveScadaConfig");
        }
      };



    handleSave = () => {
        try {
           // this.setState({ saveEnabled: false });
            if (this.state.activeTab === 0) {

                if (this.validateSave()) {
 
                    let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
                    this.setState({ showAuthenticationLayout }, () => {
                        if (showAuthenticationLayout === false) {
                            this.handleUpdateReportPrinterConfig()
                        }
                    });
                }
                else {
                    this.setState({ saveEnabled: true });
                }
            }
            else if (this.state.activeTab === 1) {
                if (this.validateSave()) {
                    let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
                    this.setState({ showAuthenticationLayout }, () => {
                        if (showAuthenticationLayout === false) {
                            this.handleUpdateLocationPrinterConfig()
                        }
                    });
                }
                else {
                    this.setState({ saveEnabled: true });
                }
            }
            else if (this.state.activeTab === 2) {
                if (this.validateSave()) {
                    
                  
                    let showAuthenticationLayout =this.props.userDetails.EntityResult.IsWebPortalUser !== true? true: false;
                    this.setState({ showAuthenticationLayout }, () => {
                        if (showAuthenticationLayout === false) {
                            this.handleUpdateBackupPrinterConfig()
                        }
                    });

                     
                }
                else {
                    this.setState({ saveEnabled: true });
                }
            }

        } catch (error) {
            console.log(
                "PrinterConfigurationDetailsComposite:Error occured on handleSave",
                error
            );
        }
    };

    validateSave() {
        var returnValue = true;
        if (this.state.activeTab === 0) {
            let validationErrors = { ...this.state.validationErrors };

            validationErrors.LocationCode = Utilities.validateField(
                PrinterConfigurationValidationDef.LocationCode,
                this.state.modReportPrinterConfig.locationCode
            );

            validationErrors.PrinterName = Utilities.validateField(
                PrinterConfigurationValidationDef.PrinterName,
                this.state.modReportPrinterConfig.printerName
            );

            this.setState({ validationErrors })

            if (returnValue)
                returnValue = Object.values(validationErrors).every(function (value) {
                    return value === "";
                });
        }

        if (this.state.activeTab === 1) {
            let validationErrors = { ...this.state.validationErrors };

            validationErrors.Location = Utilities.validateField(
                PrinterConfigurationValidationDef.Location,
                this.state.tab1_LocationCode
            );

            validationErrors.LocationCode = "";

            validationErrors.PrinterName = "";

            this.setState({ validationErrors })
            if (returnValue)
                returnValue = Object.values(validationErrors).every(function (value) {
                    return value === "";
                });
        }
        if (this.state.activeTab == 2) {
            let backUpPrinterConfig = lodash.cloneDeep(this.state.backUpPrinterConfig);
            let modBackUpPrinterConfig = lodash.cloneDeep(this.state.modBackUpPrinterConfig);

            let uniqueRecords = [
                ...new Set(
                    modBackUpPrinterConfig.map(
                        (a) => a.PrimaryPrinter
                    )
                ),
            ];

            let notification = {
                messageType: "critical",
                message: "ShipmentCompDetail_SavedStatus",
                messageResultDetails: [],
            };

            if (
                uniqueRecords.length !==
                modBackUpPrinterConfig.length
            ) {
                notification.messageResultDetails.push({
                    keyFields: [],
                    keyValues: [],
                    isSuccess: false,
                    errorMessage: "PrinterConfig_CannotConfigureMultipleBackup",
                });
                returnValue = false;
            }
            if (returnValue) {
                modBackUpPrinterConfig.forEach(item => {
                    if (item.PrimaryPrinter === ""
                        || item.PrimaryPrinter === undefined
                        || item.PrimaryPrinter === null) {
                        notification.messageResultDetails.push({
                            keyFields: [],
                            keyValues: [],
                            isSuccess: false,
                            errorMessage: "PrinterConfig_PrinterNameRequired",
                        });
                        returnValue = false;
                    }
                    else if (item.BackupPrinter === ""
                        || item.BackupPrinter === undefined
                        || item.BackupPrinter === null) {
                        notification.messageResultDetails.push({
                            keyFields: [],
                            keyValues: [],
                            isSuccess: false,
                            errorMessage: "PrinterConfig_BackupPrinterNameRequired",
                        });
                        returnValue = false;
                    }
                })
            }

            if (!returnValue && notification.messageResultDetails[0].errorMessage !== "")
                this.props.onSaved("", "", notification);
        }

        return returnValue;
    }
    handleReset = () => {
        try {
            if (this.state.activeTab == 0) {
                let modReportPrinterConfig = lodash.cloneDeep(this.state.reportPrinterConfig);
                this.setState({
                    modReportPrinterConfig,
                    validationErrors: Utilities.getInitialValidationErrors(
                        PrinterConfigurationValidationDef
                    ),
                })
            }
            else if (this.state.activeTab == 1) {
                this.setState({
                    validationErrors: Utilities.getInitialValidationErrors(
                        PrinterConfigurationValidationDef
                    ),
                })
                if (this.state.tab1_LocationCode !== null &&
                    this.state.tab1_LocationCode !== undefined &&
                    this.state.tab1_LocationCode !== ""
                )
                    this.GetPrintersForLocation(this.state.tab1_LocationCode, null)
            }
            else {
                this.setState({
                    modBackUpPrinterConfig: this.state.backUpPrinterConfig,
                    selectedBackupPrinters: []
                })
            }
        } catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error in handleReset")
        }
    }

    handleTabChange = (activeIndex) => {
        try {
            if (activeIndex !== 0)
                this.setState({
                    activeTab: activeIndex,
                    validationErrors: Utilities.getInitialValidationErrors(
                        PrinterConfigurationValidationDef
                    ),
                    reportPrinterConfig: { locationCode: null, printerName: null, selectedReports: [] },
                    modReportPrinterConfig: { locationCode: null, printerName: null, selectedReports: [] },
                    printerOptions: [],
                    tab1_LocationCode: null,
                }, () => {
                    this.GetLocationPrinterConfig();
                    this.GetAllPrinters();
                });
            else {
                this.setState({
                    activeTab: activeIndex,
                    validationErrors: Utilities.getInitialValidationErrors(
                        PrinterConfigurationValidationDef
                    )
                })
            }
        }
        catch (error) {
            console.log(
                "PrinterConfigurationDetailsComposite: Error occurred on handleTabChange",
                error
            );
        }
    };

    handleChange = (propertyName, value, cellData) => {
        try {
            if (propertyName === "report_locationCode") {
                let validationErrors = { ...this.state.validationErrors };
                let modReportPrinterConfig = lodash.cloneDeep(this.state.modReportPrinterConfig)

                modReportPrinterConfig.locationCode = value
                modReportPrinterConfig.printerName = null

                validationErrors.LocationCode = Utilities.validateField(
                    PrinterConfigurationValidationDef.LocationCode,
                    modReportPrinterConfig.locationCode
                );

                this.setState({
                    validationErrors,
                    modReportPrinterConfig
                }, () => {
                    this.GetPrintersForLocation(value, null)
                });

            }

            else if (propertyName === "report_printerName") {
                let validationErrors = { ...this.state.validationErrors };

                let modReportPrinterConfig = lodash.cloneDeep(this.state.modReportPrinterConfig)

                modReportPrinterConfig.printerName = value

                validationErrors.PrinterName = Utilities.validateField(
                    PrinterConfigurationValidationDef.PrinterName,
                    modReportPrinterConfig.printerName
                );

                this.setState({
                    validationErrors,
                    modReportPrinterConfig
                }, () => {
                    this.GetAssociatedReports(modReportPrinterConfig.locationCode, value);
                });
            }
            else if (propertyName === "locationPrinter") {
                let printerOptions = lodash.cloneDeep(this.state.printerOptions)
                if (value)
                    printerOptions.push(cellData)
                else
                    printerOptions = printerOptions.filter((item) => { return item !== cellData })
                this.setState({
                    printerOptions
                })
            }
        }
        catch (error) {
            console.log(
                "PrinterConfigurationDetailsComposite: Error occurred on handleTabChange",
                error
            );
        }
    };

    handleRowClick = (e) => {
        try {
            this.setState({
                tab1_LocationCode: e.rowData.Location,
            },
                () => {
                    this.GetPrintersForLocation(this.state.tab1_LocationCode, null)
                });
        } catch (error) {
            console.log("PrinterConfigurationDetailsComposite:Error occured on Row click", error);
        }
    };

    handleAddBackUpConfigComp = () => {
        try {
            let newBackUpConfig = {
                PrimaryPrinter: null,
                BackupPrinter: null
            }
            let modBackUpPrinterConfig = lodash.cloneDeep(this.state.modBackUpPrinterConfig)

            newBackUpConfig.SeqNumber = Utilities.getMaxSeqNumberfromListObject(modBackUpPrinterConfig);
            modBackUpPrinterConfig.push(newBackUpConfig);

            this.setState({
                modBackUpPrinterConfig
            })
        }
        catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error in handleAddBackupConfigComp")
        }
    }

    handleCellDataEdit = (newVal, cellData) => {
        try {
            let modBackUpPrinterConfig = lodash.cloneDeep(
                this.state.modBackUpPrinterConfig
            );
            modBackUpPrinterConfig[cellData.rowIndex][cellData.field] = newVal;

            this.setState({ modBackUpPrinterConfig });
        } catch (error) {
            console.log(

                "PrinterConfigurationDetailsComposite:Error occured on handleCellDataEdit",
                error
            );
        }
    };

    handleBackUpPrinterSelectionChange = (associations) => {
        this.setState({ selectedBackupPrinters: associations });
    };

    handleDeleteBackUpConfigComp = () => {
        try {
            if (
                this.state.selectedBackupPrinters != null &&
                this.state.selectedBackupPrinters.length > 0
            ) {
                if (this.state.modBackUpPrinterConfig.length > 0) {
                    let modBackUpPrinterConfig = lodash.cloneDeep(
                        this.state.modBackUpPrinterConfig
                    );

                    this.state.selectedBackupPrinters.forEach((obj, index) => {
                        modBackUpPrinterConfig = modBackUpPrinterConfig.filter(
                            (association, cindex) => {
                                return association.SeqNumber !== obj.SeqNumber;
                            }
                        );
                    });

                    this.setState({
                        modBackUpPrinterConfig,
                        selectedBackupPrinters: [],
                    });
                }
            }
        }
        catch (error) {
            console.log("PrinterConfigurationDetailsComposite : Error in handleDeleteBackUpConfigComp")
        }
    }

    handleAuthenticationClose = () => {
        this.setState({
          showAuthenticationLayout: false,
        });
      };


    
  handleOperation= () =>  {
    
    if (this.state.activeTab === 0)
      return this.handleUpdateReportPrinterConfig;
    else if (this.state.activeTab === 1)
    return this.handleUpdateLocationPrinterConfig;
    else if (this.state.activeTab === 2)
    return this.handleUpdateBackupPrinterConfig;
  };


    render() {
        const listOptions = {
            locationOptions: this.state.modlocationOptions,
            printerOptions: this.state.printerOptions,
            allPrinterOptions: this.state.allPrinterOptions,
            allAvailableReports: this.state.allAvailableReports
        };

        return this.state.isReadyToRender ? (
            <div>
                <TranslationConsumer>
                    {(t) => (
                        <ErrorBoundary>
                            <TMDetailsHeader
                                entityCode={t("PrinterConfig_Title")}
                                newEntityName="PrinterConfig_Title"
                            ></TMDetailsHeader>
                        </ErrorBoundary>
                    )}
                </TranslationConsumer>
                <ErrorBoundary>
                    <PrinterConfigurationDetails
                        listOptions={listOptions}
                        onTabChange={this.handleTabChange}
                        activeTab={this.state.activeTab}
                        modReportPrinterConfig={this.state.modReportPrinterConfig}
                        onFieldChange={this.handleChange}
                        validationErrors={this.state.validationErrors}
                        selectedReports={this.state.modReportPrinterConfig.selectedReports}
                        handleReportsSelectionChange={this.handleReportsSelectionChange}
                        selectedBackupPrinters={this.state.selectedBackupPrinters}
                        handleBackUpPrinterSelectionChange={this.handleBackUpPrinterSelectionChange}
                        modLocationPrinterConfig={this.state.modLocationPrinterConfig}
                        modBackUpPrinterConfig={this.state.modBackUpPrinterConfig}
                        onRowClick={this.handleRowClick}
                        tab1_LocationCode={this.state.tab1_LocationCode}
                        handleAddBackUpConfigComp={this.handleAddBackUpConfigComp}
                        handleDeleteBackUpConfigComp={this.handleDeleteBackUpConfigComp}
                        handleCellDataEdit={this.handleCellDataEdit}
                    ></PrinterConfigurationDetails>
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
                    functionName={functionGroups.modify}
                    functionGroup={fnPrinterConfiguration}
                    handleOperation={this.handleOperation()}
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

export default connect(mapStateToProps)(PrinterConfigurationDetailsComposite);

PrinterConfigurationDetailsComposite.propTypes = {
    selectedRow: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired
};