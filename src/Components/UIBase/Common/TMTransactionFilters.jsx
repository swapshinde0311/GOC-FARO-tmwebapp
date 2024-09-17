import React from "react";
import { TranslationConsumer } from "@scuf/localization";
import { DatePicker, Button } from "@scuf/common";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

export function TMTransactionFilters({
  handleDateTextChange,
  handleRangeSelect,
  handleLoadOrders,
  dateError,
  dateRange,
  filterText,
}) {
  //console.log(dateError);

  return (
    <TranslationConsumer>
      {(t) => (
        <div className="dateRangeContainer">
          <div className="dateRangeMargin">
            <DatePicker
              type="daterange"
              closeOnSelection={true}
              error={t(dateError)}
              displayFormat={getCurrentDateFormat()}
              //value={dateRange}
              rangeValue={dateRange}
              onTextChange={handleDateTextChange}
              onRangeSelect={handleRangeSelect}
              reserveSpace={false}
            />
          </div>
          <div className="dateSearch">
            <Button content={t(filterText)} onClick={handleLoadOrders} />
          </div>
        </div>
      )}
    </TranslationConsumer>
  );
}
