import React from 'react';
import {  Checkbox, Input, Icon, Radio, DatePicker,InputLabel } from '@scuf/common';
import { useTranslation } from "@scuf/localization";
import { DataTable } from '@scuf/datatable';
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

ProductReconciliationScheduleDetails.propTypes = {

};
export default function ProductReconciliationScheduleDetails({
  modReportSchedule,
  modReconciliationSchedules,
  validationErrors,
  columnDetails,
  onFieldChange,
  onRowClick,
  addNewSchedule,
}) {

  const [t] = useTranslation();


  function displayValues(cellData, columnDetail) {
    const { value, field } = cellData;
    if (typeof value === "boolean" || field === "Active") {
      if (value) return <Icon name="check" size="small" color="green" />;
      else return <Icon name="close" size="small" color="red" />;
    } else if (value === "" || value === null || value === undefined) {
      return value;
    }
    else if (
      columnDetail !== undefined &&
      columnDetail !== null &&
      columnDetail.DataType !== undefined &&
      columnDetail.DataType === "DateTime"
    ) {
      return (
        new Date(value).toLocaleDateString() +
        " " +
        new Date(value).toLocaleTimeString()
      );
    } else if (
      columnDetail !== undefined &&
      columnDetail !== null &&
      columnDetail.DataType !== undefined &&
      columnDetail.DataType === "Date"
    ) {
      return new Date(value).toLocaleDateString();
    } else return value;
  }

function getScheduleTitle(modSchedInfo)
{
  let scheduleTitle='';
  if(addNewSchedule)
  scheduleTitle=t("ReconciliationSchedule_AddFolioSchedule");
  else
  {
    if(modSchedInfo.IsRecurrent)
    {
      if(modSchedInfo.IsEOD)
      scheduleTitle= modReportSchedule.EntityTypeCode + "-" +  t("ReconciliationSchedule_Schedule_EOD");
      else 
      scheduleTitle= modReportSchedule.EntityTypeCode + "-" +  t("ReconciliationSchedule_Schedule_EOS");
    }
    else
    {
      scheduleTitle= modReportSchedule.EntityTypeCode + "-" +  modReportSchedule.ScheduleName;
    }
  }

  return scheduleTitle;
}

  return (
    <div className="detailsContainer">

      <div className="row">
    
        <div className="col-6 col-md-6 col-lg-6 pb-0">
          <br></br>
          {(modReconciliationSchedules!==null && modReconciliationSchedules!==undefined)?
          <DataTable
            data={modReconciliationSchedules}
            reorderableColumns={true}
            resizableColumns={true}
            searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
            onCellClick={(data) =>
              onRowClick(data.rowData)}
          >
            <DataTable.ActionBar />
            {columnDetails.map(function (columnDetail) {
              return (
                <DataTable.Column
                  initialWidth={columnDetail.Width}
                  key={columnDetail.Name}
                  field={columnDetail.Name}
                  header={t(columnDetail.Name)}
                  renderer={(cellData) => displayValues(cellData, columnDetail)}

                />
              );
            })}
            { }

          </DataTable>
  :""}

        </div>

        <div className="col-6 col-md-6 col-lg-6">
          <span>
            {modReportSchedule.EntityTypeCode !== '' || addNewSchedule===true ? (
              <h5>{getScheduleTitle(modReportSchedule)}</h5>) : ""}
          </span>
          {modReportSchedule.EntityTypeCode !== '' || addNewSchedule===true ? (
            <div >

              <div className="row">
              <div className="col-12 col-md-6 col-lg-5">
                  <Input
                    fluid
                    value={modReportSchedule.ScheduleName}
                    disabled={addNewSchedule===false?true:false || modReportSchedule.IsRecurrent===true?true:false}
                    label={t("ReconciliationSchedule_FolioName")}
                    error={t(validationErrors.ScheduleName)}
                    reserveSpace={false}
                    onChange={(data) => onFieldChange("ScheduleName", data)}
                    indicator={addNewSchedule===true && modReportSchedule.IsRecurrent===false?"required":false}
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-5">
                <InputLabel label={t("ReconciliationSchedule_Entity")} indicator={addNewSchedule===true && modReportSchedule.IsRecurrent===false?"required":false} />
                  
                  <Radio
                    label={t("Reconciliation_Tank")}
                    name="RadioGroup"
                    error={t(validationErrors.EntityTypeCode)}
                    disabled={addNewSchedule===false?true:false}
                    checked={
                      modReportSchedule.EntityTypeCode.toLowerCase() === "tank"
                        ? true
                        : false
                    }
                    onChange={() => onFieldChange("EntityTypeCode", "Tank")}
                  />
                  <Radio
                    label={t("Reconcillation_Meter")}
                    name="RadioGroup"
                    error={t(validationErrors.EntityTypeCode)}
                    disabled={addNewSchedule===false?true:false}
                    onChange={() => onFieldChange("EntityTypeCode", "Meter")}
                    checked={
                      modReportSchedule.EntityTypeCode.toLowerCase() === "meter"
                        ? true
                        : false
                    }
                  />
                </div>

              </div>

              <div className="row">
              <div className="col-12 col-md-12 col-lg-12">
              <InputLabel label={t("ReconciliationSchedule_Schedule")} indicator={addNewSchedule===true && modReportSchedule.IsRecurrent===false?"required":false} />
                  <Radio
                    label={t("ReconciliationSchedule_Recurrent")}
                    name="OccuranceGroup"
                    error={t(validationErrors.ScheduleType)}
                    disabled={addNewSchedule===false?true:false}
                    onChange={() => onFieldChange("IsRecurrent", true)}
                    checked={
                      modReportSchedule.IsRecurrent.toString().toLowerCase() === "true"
                        ? true
                        : false
                    }

                  />
                  <Radio
                    label={t("ReconciliationSchedule_OneTime")}
                    name="OccuranceGroup"
                    onChange={() => onFieldChange("IsRecurrent", false)}
                    checked={
                      modReportSchedule.IsRecurrent.toString().toLowerCase() === "false"
                        ? true
                        : false
                    }
                    
                     disabled={addNewSchedule===false?true:false}
                  />

                  <Checkbox
                    
                    onChange={() => onFieldChange("IsEOD", true)}
                    checked={
                      modReportSchedule.IsEOD.toString().toLowerCase() === "true"
                        ? true
                        : false
                    }
                    disabled={addNewSchedule===false|| modReportSchedule.IsRecurrent===false?true:false}
                    label={t("ReconciliationSchedule_Schedule_EOD")}
                  ></Checkbox>
                  <Checkbox
                    onChange={() => onFieldChange("IsEOS", true)}
                    checked={
                      modReportSchedule.IsEOS.toString().toLowerCase() === "true"
                        ? true
                        : false
                    }
                    disabled={addNewSchedule===false|| modReportSchedule.IsRecurrent===false?true:false}
                    label={t("ReconciliationSchedule_Schedule_EOS")}
                  ></Checkbox>
                </div>
                

                 
              </div>
              <div className="row">
                  <div className="col-12 col-md-12 col-lg-8">
                  <DatePicker
                    fluid
                    value={modReportSchedule.StartDateTime == null ? '' : new Date(modReportSchedule.StartDateTime)}
                    label={t("ReconciliationSchedule_OneTime_Start")}
                    disablePast={false}
                    type="datetime"
                    indicator={addNewSchedule===true && modReportSchedule.IsRecurrent===false?"required":false}
                    error={t(validationErrors.StartDateTime)}
                    onChange={(data) => onFieldChange("StartDateTime", data)}
                    displayFormat={getCurrentDateFormat()}
                    minuteStep={1}
                    reserveSpace={false}
                    disabled={addNewSchedule===true && modReportSchedule.IsRecurrent===false?false:true}

                  />
                </div>
              </div>
              <div className="row">
              <div className="col-12 col-md-12 col-lg-8">
                  <DatePicker
                    fluid
                    value={modReportSchedule.EndDateTime == null ? '' : new Date(modReportSchedule.EndDateTime)}
                    label={t("ReconciliationSchedule_OneTime_End")}
                    disablePast={false}
                    error={t(validationErrors.EndDateTime)}
                    type="datetime"
                    indicator={addNewSchedule===true && modReportSchedule.IsRecurrent===false?"required":false}
                    onChange={(data) => onFieldChange("EndDateTime", data)}
                    displayFormat={getCurrentDateFormat()}
                    minuteStep={1}
                    reserveSpace={false}
                    disabled={addNewSchedule===true && modReportSchedule.IsRecurrent===false?false:true}
                  />
                </div>

              </div>
            </div>) : ""}
        </div>
      </div>
    </div>

  );
}
