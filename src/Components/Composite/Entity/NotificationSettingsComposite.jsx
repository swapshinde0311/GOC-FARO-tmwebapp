import React, { Component } from "react";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
import {Tab} from "@scuf/common";
import  NotificationGroupComposite  from "../Entity/NotificationGroupComposite";
import NotificationRestrictionComposite from "../Entity/NotificationRestrictionComposite";
import NotificationMessageComposite from "../Entity/NotificationMessageComposite";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TranslationConsumer } from "@scuf/localization";
class NotificationSettingsComposite extends Component {
    
    render() {
        return (
            <div>
                <ErrorBoundary>
                    <TMUserActionsComposite
                        breadcrumbItem={this.props.activeItem}
                        shareholders={this.props.userDetails.EntityResult.ShareholderList}
                        deleteVisible={false}
                        addVisible={false}
                        shrVisible={false}
                        handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                    ></TMUserActionsComposite>
                </ErrorBoundary>
                <TranslationConsumer>
            {(t) => (
                   <div className="notificationTabAlignment">
                 <Tab defaultActiveIndex={0}>
                  <Tab.Pane title={t("Group")}>
                <NotificationGroupComposite />
                </Tab.Pane>
                <Tab.Pane title={t("Messages")}>
                  <NotificationMessageComposite/>
                </Tab.Pane>
                <Tab.Pane title={t("Restriction")}>
                <NotificationRestrictionComposite />
                </Tab.Pane>
                </Tab>
                            
                </div>
                    )}
                </TranslationConsumer>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        userDetails: state.getUserDetails.userDetails,
        tokenDetails: state.getUserDetails.TokenAuth,
    };
};

export default connect(mapStateToProps)(NotificationSettingsComposite);

NotificationGroupComposite.propTypes = {
    activeItem: PropTypes.object,
};