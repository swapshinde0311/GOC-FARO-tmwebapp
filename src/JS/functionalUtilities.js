import moment from "moment";
import "moment/min/locales";
import React from "react";
export function getOptionsWithSelect(ddlOptions, selectOptionText) {
  if (Array.isArray(ddlOptions)) {
    let selectOptions = ddlOptions.filter(
      (option) => option.text === selectOptionText
    );
    if (selectOptions.length === 0)
      ddlOptions.unshift({
        value: null,
        text: selectOptionText,
      });
  }
  return ddlOptions;
}

export function getCurrentDateFormat() {
  let language = window.navigator.userLanguage || window.navigator.language;
  moment.locale(language);
  let localeData = moment.localeData();
  // console.log(localeData);
  var format = localeData.longDateFormat("L");
  //console.log(format);
  return format;
}


export function handleIsRequiredCompartmentCell(data) {
  return (
    <div><span>{data}</span><div class="ui red circular empty label badge  circle-padding" /></div>
  );
}