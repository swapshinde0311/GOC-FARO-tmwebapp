import React from "react";
import { Input, Select } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { TimePickerMod as TimePicker } from "../Common/TimePicker";
import moment from "moment-timezone";
ShiftConfigurationDetails.propTypes = {
    shiftConfig: PropTypes.object.isRequired,
    modShiftConfig: PropTypes.object.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onFieldChange: PropTypes.func.isRequired,
}

ShiftConfigurationDetails.defaultProps = {
    isEnterpriseNode: false,
    terminalCode: [],
}

export function ShiftConfigurationDetails({
    shiftConfig,
    modShiftConfig,
    validationErrors,
    onFieldChange,
}) {
    return (
        <TranslationConsumer>
            {(t, index) => (
                <div className="detailsContainer">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                key={index}
                                fluid
                                value={modShiftConfig.Name}
                                indicator="required"
                                disabled={shiftConfig.Name !== ""}
                                onChange={(data) => onFieldChange("Name", data)}
                                label={t("ShiftInfo_ShiftName")}
                                error={t(validationErrors.Name)}
                                reserveSpace={false}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <TimePicker
                                value={moment(
                                    modShiftConfig.StartTime === null ||
                                        modShiftConfig.StartTime === undefined ||
                                        modShiftConfig.StartTime === ""
                                        ? new Date().setSeconds(0)
                                        : new Date(modShiftConfig.StartTime).setSeconds(0)
                                )}
                                label={t("ShiftInfo_StartTime")}
                                displayFormat={"hh:mm A"}
                                onChange={(data) =>
                                    onFieldChange("StartTime", moment(data).format())
                                }
                                error={t(validationErrors.StartTime)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 ">
                            <TimePicker
                                value={moment(
                                    modShiftConfig.EndTime === null ||
                                        modShiftConfig.EndTime === undefined ||
                                        modShiftConfig.EndTime === ""
                                        ? new Date().setSeconds(0)
                                        : new Date(modShiftConfig.EndTime).setSeconds(0)
                                )}
                                label={t("ShiftInfo_EndTime")}
                                displayFormat={"hh:mm A"}
                            onChange={(data) =>
                                onFieldChange("EndTime", moment(data).format())
                            }
                                error={t(validationErrors.EndTime)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <Input
                                fluid
                                value={modShiftConfig.Remarks}
                                label={t("Description")}
                                onChange={(data) => onFieldChange("Remarks", data)}
                                error={t(validationErrors.Remarks)}
                                reserveSpace={false}
                            />
                        </div>
                    </div>
                </div>

            )}
        </TranslationConsumer>
    )
}

