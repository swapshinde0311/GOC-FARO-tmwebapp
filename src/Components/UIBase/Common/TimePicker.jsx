import React from "react";
import "../../../CSS/timePickerStyles.css";
import TimePicker from "rc-time-picker";

TimePickerMod.defaultProps = {
  disabled: false,
};

export function TimePickerMod({
  value,
  label,
  displayFormat,
  onChange,
  disabled,
  error,
}) {
  return (
    <div>
      <div className="ui input-label">
        <span className="input-label-message">{label}</span>
      </div>
      <div className="ui single-input picker-input datetime-time  fluid has-icon">
        <TimePicker
          showSecond={false}
          defaultValue={value}
          value={value}
          onChange={onChange}
          format={displayFormat}
          use12Hours
          className="input-wrap"
          disabled={disabled}
          error={error}
        />
      </div>
    </div>
  );
}
