import React, { Component } from "react";
import { TranslationConsumer } from "@scuf/localization";
import { Icon, Checkbox, Input } from "@scuf/common";
import * as Constants from "./../../../JS/Constants";

class HSEInspectionDrawer extends Component {
  state = {
    isFolded: false
  }

  switchFold = () => {
    this.setState({
      isFolded: !this.state.isFolded
    });
  }

  render() {
    let headerClass = "hse-inspection-drawer-header";
    if (this.props.status === Constants.HSEInspectionStatus.PASS) {
      headerClass += " hse-inspection-drawer-header-pass";
    } else if (this.props.status === Constants.HSEInspectionStatus.FAIL) {
      headerClass += " hse-inspection-drawer-header-failure";
    }

    const itemList = [];
    for (let item of this.props.inspectedItems) {
      itemList.push(
        <TranslationConsumer key={item.ID}>
          {(t) => (
            <div className="hse-inspection-drawer-question">
              <div className={`hse-inspection-drawer-question-severity 
              ${item.Severity === "0" ? "severity-0" : "severity-1"}`}></div>
              <div className="hse-inspection-drawer-question-block-1">
                <Checkbox
                  checked={item.Status}
                  onChange={(checked) => this.props.onChange(item.ID, "Status", checked)}
                  disabled={!this.props.isEditable}
                />
              </div>
              <div className={"hse-inspection-drawer-question-block-2" + 
                (item.LastUpdatedTime === "" ? " hse-inspection-drawer-question-block-2-no-time" : "")}>
                <div>{item.LocalizedText}</div>
                <Input
                  placeholder={t("Vehicle_Remarks")}
                  value={item.Remarks}
                  onChange={(data) => this.props.onChange(item.ID, "Remarks", data)}
                  disabled={!this.props.isEditable}
                />
              </div>
              {item.LastUpdatedTime === "" ? null : (
                <div className="hse-inspection-drawer-question-block-3">
                  <div className="hse-inspection-drawer-question-last-updated">
                    <Icon root="Common" name="calendar" size="large"/>
                  </div>
                  <div className="hse-inspection-drawer-question-last-updated">
                    <div>{t("Common_LastUpdated")}</div>
                    <div>{new Date(item.LastUpdatedTime).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </TranslationConsumer>
      );
    }

    let iconClass;
    switch (this.props.transportationType) {
      case Constants.TransportationType.ROAD:
        iconClass = " icon-Road";
        break;
      case Constants.TransportationType.MARINE:
        iconClass = " icon-Marine";
        break;
      case Constants.TransportationType.RAIL:
        iconClass = " icon-Rail";
        break;
      case Constants.TransportationType.PIPELINE:
        iconClass = " icon-Pipeline";
        break;
      default:
        iconClass = "";
    }

    return (
      <TranslationConsumer>
        {(t) => (
          <div>
            <div className={headerClass}>
              <span className={`hse-inspection-drawer-header-icon${iconClass}`} root="common"></span>
              <span className="hse-inspection-drawer-header-text">{this.props.title + " HSE Inspection"}</span>
              <div className="hse-inspection-drawer-header-button" onClick={this.switchFold}>
                <Icon
                  root="Building"
                  name={this.state.isFolded ? "caret-down" : "caret-up"}
                  size="large"
                />
              </div>
            </div>
            {this.state.isFolded ? null : (
              <div className="hse-inspection-drawer-content">
                {itemList}
                {/* <div style={{marginTop: "1rem"}}>
                  <Button
                    type="primary"
                    content={t("VehHSE_Pass")}
                    disabled={!this.props.isEditable}
                    onClick={() => this.props.handleUpdate(1, false)}
                  />
                  <Button
                    type="primary"
                    content={t("VehHSE_Fail")}
                    disabled={!this.props.isEditable}
                    onClick={() => this.props.handleUpdate(2, false)}
                  />
                </div> */}
              </div>
            )}
            <div className="hse-inspection-drawer-footer"></div>
          </div>
        )}
      </TranslationConsumer>
    );
  }
}

export default HSEInspectionDrawer;