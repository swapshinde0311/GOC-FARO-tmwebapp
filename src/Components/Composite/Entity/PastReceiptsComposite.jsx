import React, { Component } from "react";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import * as Constants from "../../../JS/Constants";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import "../../../CSS/styles.css";
import * as Utilities from "../../../JS/Utilities";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { PastReceiptsDetail } from "../../UIBase/Details/PastReceiptsDetail";
import ReportDetails from "../../UIBase/Details/ReportDetails";
import dayjs from "dayjs";
import { Icon } from '@scuf/common';
import { TranslationConsumer } from "@scuf/localization";
class PastReceiptsComposite extends Component {
    state = {

        data: [],
        searchList: [],
        searchText: "",
        viewBODCode: "",
        viewBODShareholder: "",
        showReport: false,
        selectedDate: dayjs()
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .set("millisecond", 0),
    };

    componentDidMount() {
        try {
            this.getPastReceiptsListForRole();

        } catch (error) {
            console.log(
                "PastReceiptsComposite:Error occured on ComponentDidMount",
                error
            );
        }

    }
    componentWillUnmount = () => {

    }

    getPastReceiptsListForRole = () => {
        try {
            axios(
                RestAPIs.GetPastReceiptListForRole,
                Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
            )
                .then((response) => {

                    let data = response.data;
                    if (data.IsSuccess === true) {
                        this.setState({ data: data.EntityResult.Table }, () => { this.onSearchChange(""); });
                    }

                    //this.setState({ menu: json.menu},()=>this.updateMenu)
                })
                .catch((error) => {
                    console.log("Error in getPastReceiptsListForRole API:", error);
                });
        } catch (error) {
            console.log(
                "PastReceiptsComposite:Error occured on getPastReceiptsListForRole",
                error
            );
        }
    }

    onSearchChange = (data) => {
        try {
            let dataset = this.state.data;
            let selectedDate = this.state.selectedDate.format("DD MMM YYYY");
            let results = [];
            if (data === "") {

                results = dataset.filter(element => {
                    return dayjs(element.ReceiptByCompartmentList_UnloadedDate).format("DD MMM YYYY") === selectedDate;
                });

            } else {

                results = dataset.filter(element => {
                    return dayjs(element.ReceiptByCompartmentList_UnloadedDate).format("DD MMM YYYY") === selectedDate && element.Code.toLowerCase().includes(data.toLowerCase());
                });
            }
            this.setState({ searchList: results, searchText: data });
        } catch (error) {
            console.log(
                "PastReceiptsComposite:Error occured on onSearchChange",
                error
            );
        }

    }

    handleDateChange = (duration) => {
        try {
            let selectedDate = this.state.selectedDate;
            selectedDate = selectedDate.add(duration, "day");
            this.setState({
                selectedDate
            }, () => { this.onSearchChange(this.state.searchText); });

        } catch (error) {
            console.log("error in handleDateChanage", error);
        }
    }

    handleViewBOD = (Code, ShareHolder) => {
        //this.handleAuthenticationClose();
        this.setState({ viewBODCode: Code, viewBODShareholder: ShareHolder });
        if (this.reportServiceURI === undefined) {
            axios(
                RestAPIs.GetReportServiceURI,
                Utilities.getAuthenticationObjectforGet(
                    this.props.tokenDetails.tokenInfo
                )
            ).then((response) => {
                if (response.data.IsSuccess) {
                    this.reportServiceURI = response.data.EntityResult;
                    this.setState({ showReport: true });
                }
            });
        } else {
            this.setState({ showReport: true });
        }
    };

    handleModalBack = () => {
        this.setState({ showReport: false });
    };
    renderModal() {
        let path = null;
        if (this.props.userDetails.EntityResult.IsArchived) {
            path = "TM/" + Constants.TMReportArchive + "/TMBOD";
        } else {
            path = "TM/" + Constants.TMReports + "/TMBOD";
        }

        let paramValues = {
            Culture: this.props.userDetails.EntityResult.UICulture,
            Shareholder: this.state.viewBODShareholder,
            ReceiptCode: this.state.viewBODCode,
        };

        return (
            <ReportDetails
                showReport={this.state.showReport}
                handleBack={this.handleModalBack}
                handleModalClose={this.handleModalBack}
                // proxyServerHost="http://epksr5115dit:3625/TMWebAPI/"
                proxyServerHost={RestAPIs.WebAPIURL}
                reportServiceHost={this.reportServiceURI}
                filePath={path}
                parameters={paramValues}
            />
        );
    }
    render() {
        return (
            <TranslationConsumer>
                {(t) => (
                    <div>
                        <ErrorBoundary>
                            <div className="ui breadcrumb pl-1 mobile-bread-crumb mobile-align-items-start">
                                <div className="section pl-1 mt-sm-2 mt-lg-0">
                                    <span>
                                        {t("PastReceipts")}
                                    </span>
                                </div>
                            </div>
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <PastReceiptsDetail data={this.state.searchList}
                                selectedDate={this.state.selectedDate}
                                onSearchChange={this.onSearchChange}
                                handleDateChange={this.handleDateChange}
                                handleViewBOD={this.handleViewBOD}>
                            </PastReceiptsDetail>
                            {Object.keys(this.state.searchList).length > 0
                                ? this.renderModal()
                                : ""}
                        </ErrorBoundary>
                    </div >
                )}
            </TranslationConsumer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userDetails: state.getUserDetails.userDetails,
        tokenDetails: state.getUserDetails.TokenAuth,
    };
};

export default connect(mapStateToProps)(PastReceiptsComposite);

PastReceiptsComposite.propTypes = {
    activeItem: PropTypes.object,
};
