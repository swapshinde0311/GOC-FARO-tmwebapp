import React from "react";
import { Input } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";

export function SlotConfigurationDetail({
  //slotConfiguration,//wil use if we add reset button
  modSlotConfiguration,
  validationErrors,
  onFieldChange,
}) {
  return (
    <TranslationConsumer>
      {(t) => (
        <div className="detailsContainer">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modSlotConfiguration.SlotParams.SlotStartTime.Value}
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("SlotStartTime", data)}
                label={t("SlotStartTime")}
                error={t(validationErrors.SlotStartTime)}
                reserveSpace={false}
              />
            </div>
            {/* <div className="col-12 col-md-6 col-lg-4">
              <Tooltip
                content="Slot start time"
                element={
                  <TimePicker
                    value={moment(
                      modSlotConfiguration.SlotParams.SlotStartTime === null
                        ? new Date().setSeconds(0)
                        : new Date().setHours(
                            Number(
                              modSlotConfiguration.SlotParams.SlotStartTime.Value.toString()
                                .split(":")[0]
                                .toString()
                            ),
                            Number(
                              modSlotConfiguration.SlotParams.SlotStartTime.Value.toString()
                                .split(":")[1]
                                .toString()
                            )
                          )
                    )}
                    label={t("SlotStartTime")}
                    displayFormat={"hh:mm"}
                    onChange={(data) =>
                      onFieldChange("SlotStartTime", moment(data).format())
                    }
                  />
                }
                position="left center"
                event="focus"
                hoverable={true}
              />
            </div> */}
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modSlotConfiguration.SlotParams.SlotEndTime.Value}
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("SlotEndTime", data)}
                label={t("SlotEndTime")}
                error={t(validationErrors.SlotEndTime)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modSlotConfiguration.SlotParams.PreLoadingDuration.Value}
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("PreLoadingDuration", data)}
                label={t("PreLoadingDuration")}
                error={t(validationErrors.PreLoadingDuration)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modSlotConfiguration.SlotParams.SlotDuration.Value}
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("SlotDuration", data)}
                label={t("SlotConfiguration_SlotDuration")}
                error={t(validationErrors.SlotDuration)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modSlotConfiguration.SlotParams.PostLoadingDuration.Value
                }
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("PostLoadingDuration", data)}
                label={t("PostLoadingDuration")}
                error={t(validationErrors.PostLoadingDuration)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modSlotConfiguration.SlotParams.MaxNoOfSlots.Value}
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("MaxNoOfSlots", data)}
                label={t("MaxNoOfSlots")}
                error={t(validationErrors.MaxNoOfSlots)}
                reserveSpace={false}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modSlotConfiguration.SlotParams.BookAdvSlotMinutes.Value}
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("BookAdvSlotMinutes", data)}
                label={t("BookAdvSlotMinutes")}
                error={t(validationErrors.BookAdvSlotMinutes)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modSlotConfiguration.SlotParams.AdvanceSlotBookMaxDays.Value
                }
                indicator="required"
                disabled={false}
                onChange={(data) =>
                  onFieldChange("AdvanceSlotBookMaxDays", data)
                }
                label={t("AdvanceSlotBookMaxDays")}
                error={t(validationErrors.AdvanceSlotBookMaxDays)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={
                  modSlotConfiguration.SlotParams.ChangeAdvSlotMinutes.Value
                }
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("ChangeAdvSlotMinutes", data)}
                label={t("ChangeAdvSlotMinutes")}
                error={t(validationErrors.ChangeAdvSlotMinutes)}
                reserveSpace={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                fluid
                value={modSlotConfiguration.SlotParams.RefreshInterval.Value}
                indicator="required"
                disabled={false}
                onChange={(data) => onFieldChange("RefreshInterval", data)}
                label={t("RefreshInterval")}
                error={t(validationErrors.RefreshInterval)}
                reserveSpace={false}
              />
            </div>
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
