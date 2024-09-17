import { Button, DatePicker, Icon, Select, Tooltip } from '@scuf/common';
import { TranslationConsumer } from '@scuf/localization';
import React from 'react';
import * as wijmoPdf from "@grapecity/wijmo.pdf";
import * as wijmo from "@grapecity/wijmo";
import { toPng } from "html-to-image";
import PropTypes from 'prop-types';
import ErrorBoundary from '../../ErrorBoundary';
import { DataTable } from '@scuf/datatable';
import * as Utilities from '../../../JS/Utilities';
import { connect } from 'react-redux';
import LACSeriesChart from '../Common/Charts/LACSeriesChart';
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";
import { LoadingPage } from '../../UIBase/Common/LoadingPage';
import DashboardCard from '../Common/Charts/WidgetOutlines/DashboardCard';

class ProductDemandForecastingDetailsComposite extends React.Component {
    state = {
        chartRef: React.createRef(),
        isDownloading: false,
    }

    downloadBtnClick = (t, overallCapacity, inventory, uom) => {
        this.setState({
            isDownloading: true
        }, () => {
            let doc = new wijmoPdf.PdfDocument({
                // method to execute on end
                ended: (s, e) => {
                    if (e.blob) {
                        this.setState({ isDownloading: false }, () => {
                            wijmoPdf.saveBlob(e.blob, "ProductDemandForecast.pdf");
                        })
                    }
                },
                pageSettings: {
                    margins: {
                        left: 20,
                        top: 20,
                        right: 20,
                        bottom: 20,
                    },
                    layout: wijmoPdf.PdfPageOrientation.Portrait,
                }
            });

            try {
                toPng(
                    this.state.chartRef.hostElement,
                    { cacheBust: true }
                ).then(url => {
                    let colWidth = 140, rowHeight = 30;
                    // report header
                    doc.drawText(t("ProductDemandForecast_Report"), null, null, {
                        align: wijmoPdf.PdfTextHorizontalAlign.Center,
                        font: new wijmoPdf.PdfFont('times', 16, 'normal', 'bold'),
                        lineGap: 40
                    });

                    // base product details
                    doc.drawText(t("ProductDemandForecast_Product"), 0, doc.y, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold'),
                        continued: true
                    });

                    doc.drawText(this.props.baseProduct, null, null, {
                        continued: true,
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'normal')
                    });

                    // exported date
                    doc.drawText(t("ProductForecast_PrintDate"), 265, doc.y, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold'),
                        continued: true
                    });
                    doc.drawText(new Date().toLocaleString(), null, null, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'normal'),
                    });

                    // selected forecasting period
                    doc.drawText(t("ProductDemandForecast_Duration"), null, null, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold'),
                        continued: true
                    });

                    doc.drawText(new Date().toLocaleDateString() + " - " + this.props.endDate.toLocaleDateString(), null, null, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'normal'),
                        lineGap: 20
                    });

                    let x = 0;
                    let y = doc.y;

                    // selected tank details
                    doc.paths.rect(x, y, 560, rowHeight).stroke();

                    doc.drawText(t("Tank_Details_Label") + ": ", x + 2, y + 2, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold'),
                        continued: true
                    });

                    // overall capacity and available inventory of selected tanks
                    doc.drawText(t("Overall_Capacity_Label") + "- " + String(overallCapacity) + " " + uom + ", " + t("Inventory_Label") + "- " + String(inventory) + " " + uom, doc.x, y + 2, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'normal'),
                    });

                    y += rowHeight;

                    // table to show list of selected tanks
                    doc.paths.rect(x, y, colWidth, rowHeight).stroke();
                    doc.drawText(t("TankCode"), x + 2, y + 2, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + colWidth, y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_Inventory", [uom]), x + colWidth + 2, y + 2, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + (2 * colWidth), y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_Capacity", [uom]), x + (2 * colWidth) + 2, y + 2, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + (3 * colWidth), y, colWidth, rowHeight).stroke();
                    doc.drawText(t("TankInfo_Mode"), x + (3 * colWidth) + 2, y + 2, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });

                    // columns in the tanks list data object
                    let tankColumns = ["Code", "Capacity", "GrossQuantity", "TankMode"];
                    // for each tank, create a table row and populate respective columns
                    this.props.selectedTanks.forEach((tank) => {
                        y += rowHeight;
                        // if current 'y' position exceeds document height, add a new page
                        if (y >= doc.height) {
                            y = 0;
                            doc.addPage();
                        }

                        // for each column, create a cell and populate data
                        tankColumns.forEach((col, index) => {
                            let cellText = tank[col] === null || tank[col] === undefined ?
                                "" : String(tank[col]);
                            if (col === "Code") {
                                if (!tank["Active"]) {
                                    cellText += " (" + t("ProductForecast_InactiveTank") + ")";
                                }
                                else {
                                    cellText += " (" + t("ProductForecast_ActiveTank") + ")";
                                }
                            }

                            // create and populate table cell
                            doc.paths.rect(x + (index * colWidth), y, colWidth, rowHeight).stroke();
                            doc.drawText(cellText, x + (index * colWidth) + 2, y + 2, {
                                font: new wijmoPdf.PdfFont("times", 12, "normal", "normal"),
                                width: colWidth - 2
                            });
                        });
                    })

                    // if current 'y' position is greater than half of doc height, add new page
                    if (doc.y > doc.height / 2) {
                        doc.addPage();
                    }
                    // else move 'y' position down by 3 units
                    else {
                        doc.moveDown(3);
                    }

                    let currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    doc.drawText(t("ProductDemandForecast_ForecastTableDetails", [Utilities.DateDiffInDays(currentDate, this.props.endDate)]), 0, doc.y, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold'),
                        lineGap: 20
                    });

                    // dividing the table into 7/8 columns based on Slot Availability feature
                    colWidth = (this.props.isSlotEnabled ? 70 : 80); rowHeight = 40; y = doc.y;

                    // add row headers for forecast details table
                    doc.paths.rect(x, y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_Date"), x + 2, y + 2, {
                        width: colWidth - 2,
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + colWidth, y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_OpeningInventory", [uom]), x + colWidth + 2, y + 2, {
                        width: colWidth - 2,
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + (2 * colWidth), y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_OpeningUllage", [uom]), x + (2 * colWidth) + 2, y + 2, {
                        width: colWidth - 2,
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + (3 * colWidth), y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_PlannedReceipts", [uom]), x + (3 * colWidth) + 2, y + 2, {
                        width: colWidth - 2,
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + (4 * colWidth), y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_PlannedShipments", [uom]), x + (4 * colWidth) + 2, y + 2, {
                        width: colWidth - 2,
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + (5 * colWidth), y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_ClosingInventory", [uom]), x + (5 * colWidth) + 2, y + 2, {
                        width: colWidth - 2,
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });
                    doc.paths.rect(x + (6 * colWidth), y, colWidth, rowHeight).stroke();
                    doc.drawText(t("ProductForecast_ClosingUllage", [uom]), x + (6 * colWidth) + 2, y + 2, {
                        width: colWidth - 2,
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                    });

                    let forecastColumns = ["ForecastDate", "OpenInventory", "OpenUllage", "PlannedReceiptQty", "ShipQtyDemand", "CloseInventory", "CloseUllage"];

                    // if slot availability feature is available, add Slot Availability column
                    if (this.props.isSlotEnabled) {
                        doc.paths.rect(x + (7 * colWidth), y, colWidth, rowHeight).stroke();
                        doc.drawText(t("ProductForecast_SlotAvailability"), x + (7 * colWidth) + 2, y + 2, {
                            width: colWidth - 2,
                            font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold')
                        });

                        forecastColumns.push(["ROADSlots", "MarineSlots"])
                    }

                    // add table row for each day
                    this.props.forecastDetails.forEach(row => {
                        y += rowHeight;
                        // if current 'y' position exceeds document height, add a new page
                        if (y >= doc.height - 20) {
                            y = 0;
                            doc.addPage();
                        }

                        // add table cell for each column
                        forecastColumns.forEach((col, index) => {
                            let cellText = "";
                            let xPad = 2;
                            doc.paths.rect(x + (index * colWidth), y, colWidth, rowHeight).stroke();
                            // for slot availability column
                            if (index === 7) {
                                cellText = "Not Available"
                                if (row[col[0]] > 0) {
                                    cellText = "Truck";
                                }
                                if (row[col[1]] > 0) {
                                    cellText = (cellText === "Truck") ? (cellText + " | Marine") : "Marine";
                                }
                            } else {
                                cellText = String(row[col]);
                            }

                            // draw 'circle' based planned shipments quantity value
                            if (col === "ShipQtyDemand") {
                                // if shipments quantity is well below available inventory, draw green circle
                                let color = "green";
                                // mass/volume tolerance value based on product
                                const tolerance = this.props.isVolume ? this.props.configuration.tolerance.Volume : this.props.configuration.tolerance.Mass;
                                // if shipments quantity exceeds available inventory, draw red circle
                                if (Number(row[col]) > row["OpenInventory"]) {
                                    color = "red";
                                }
                                // if shipments quantity is close the available inventory (based on tolerance), draw yellow circle
                                else if (Number(row[col]) + Number(tolerance) > row["OpenInventory"]) {
                                    color = "yellow";
                                }
                                xPad = 12;
                                doc.paths.circle(x + (index * colWidth) + 5, y + 6, 4).fill(new wijmo.Color(color));
                            }

                            doc.drawText(cellText, x + (index * colWidth) + xPad, y + 2, {
                                width: colWidth - xPad,
                                font: new wijmoPdf.PdfFont('times', 12, 'normal', 'normal')
                            });
                        });
                    })

                    // add new page for forecast overview chart
                    doc.addPage();

                    doc.drawText(t("ProductDemandForecast_ForecastOverview"), null, null, {
                        font: new wijmoPdf.PdfFont('times', 12, 'normal', 'bold'),
                        lineGap: 20
                    });

                    // draw the image generated by 'toPng'
                    doc.drawImage(url, undefined, undefined, {
                        width: 560,
                        align: wijmoPdf.PdfImageHorizontalAlign.Center,
                    });

                    // call end() method
                    doc.end();
                }).catch(error => {
                    console.log("Error converting HTML to image: ", error);
                    this.setState({ isDownloading: false });
                })

            }
            catch (error) {
                this.setState({ isDownloading: false });
                console.log("Error generating PDF: ", error);
            }
        });
    }

    setRefs = (key, ref, sequence) => {
        this.setState({
            chartRef: ref
        });
    }

    fetchChartConfiguration = (t, tolerance, uom, overAllCapacity) => {
        let chartInfo = {}
        if (Array.isArray(this.props.forecastDetails)) {
            chartInfo = {
                JSONFormat: '{"Chart": {"ChartDetails": {"bindings": {"seriesSource": "Table"}, "common": {"bindingX": "ForecastDate", "ChartType": "Line", "name": "Days"}, "chartLegend": {"position":"Right"}, "seriesData": [{"name": "Default_lblShipment", "binding": "ShipQtyDemand", "chartType": "Column"}, {"name": "Inventory_Label", "binding": "OpenInventory", "chartType": "Area"}], "chartAxis": [{"wjProperty": "axisY", "title": "' + t("ProductForecast_Quantity", [uom]) + '", "axisLine": true, "position": "Left"}]}, "Thresholds": [{"Value":' + tolerance +
                    ', "Name": "Tolerance_Level", "tooltipContent": {"Label":"Tolerance_Level", "Value": "{y}"}}, {"Value": ' + String(overAllCapacity) + ', "Name": "Total_Capacity", "tooltipContent": {"Label": "Total_Capacity", "Value":"{y}"}}]}}',
                KPIData: { Table: this.props.forecastDetails }
            }
        }

        return chartInfo;
    }

    render() {
        let overAllCapacity = 0, inventory = 0;
        // configured mass/volume uom based on product
        const uom = (this.props.isVolume ? this.props.configuration.uoms.Volume : this.props.configuration.uoms.Mass);
        // configured mass/volume tolerance based on product
        const tolerance = String(this.props.isVolume ? this.props.configuration.tolerance.Volume : this.props.configuration.tolerance.Mass);

        // calculate overallCapacity & available inventory for selected tanks
        if (Array.isArray(this.props.selectedTanks)) {
            this.props.selectedTanks.forEach(tank => {
                overAllCapacity += Number(tank.Capacity);
                inventory += Number(tank.GrossQuantity);
            });
        }

        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        return (
            <div>
                <ErrorBoundary>
                    <TranslationConsumer>
                        {
                            (t) => (
                                <div>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <Button
                                                className='btn-download-product-forecast'
                                                type='primary'
                                                onClick={() => this.downloadBtnClick(t, overAllCapacity, inventory, uom)}
                                                disabled={!this.props.isChartDataReady || this.state.isDownloading}
                                                actionType='button'>
                                                {t("Chart_Download")}
                                            </Button>
                                        </div>
                                        <div className='col-12 col-md-12 col-lg-5 col-xxl-4'>
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <Select
                                                        options={this.props.baseProductsList}
                                                        multiple={false}
                                                        disabled={this.state.isDownloading}
                                                        placeholder={t("Common_Select")}
                                                        label={t("BPCode")}
                                                        value={this.props.baseProduct}
                                                        onChange={val => this.props.onChange("BaseProduct", val)}
                                                        reserveSpace={false}
                                                        error={t(this.props.validationErrors.BaseProduct)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-12 col-md-10 p-0'>
                                                    <div className='row m-0 p-0'>
                                                        <div className='col-12 col-md-6 product-demand-forecasting-date'>
                                                            <DatePicker
                                                                disabled={true}
                                                                label={t("From")}
                                                                displayFormat={getCurrentDateFormat()}
                                                                type="date"
                                                                reserveSpace={false}
                                                                value={new Date()} />
                                                        </div>
                                                        <div className='col-12 col-md-6 product-demand-forecasting-date'>
                                                            <DatePicker
                                                                type="date"
                                                                disabled={this.state.isDownloading}
                                                                label={t('To')}
                                                                displayFormat={getCurrentDateFormat()}
                                                                disablePast={true}
                                                                onChange={val => this.props.onChange("EndDate", val)}
                                                                onTextChange={val => this.props.onChange("EndDate", val)}
                                                                value={this.props.endDate}
                                                                reserveSpace={false}
                                                            />
                                                        </div>
                                                        {
                                                            this.props.validationErrors.EndDate !== "" ?
                                                                <div className='col-12 below-text'>
                                                                    <span className='ui error-message'>
                                                                        {t(this.props.validationErrors.EndDate, [this.props.configuration.maxDuration])}
                                                                    </span>
                                                                </div> : null
                                                        }
                                                    </div>
                                                </div>
                                                <div className='col-12 col-md-2 mt-md-4 pl-md-0'>
                                                    <Button
                                                        type="primary"
                                                        className='product-demand-forecast-go-btn'
                                                        actionType="button"
                                                        disabled={this.props.isLoading || this.state.isDownloading}
                                                        onClick={this.props.onGoClick}>
                                                        {t("Common_Go")}
                                                    </Button>
                                                </div>
                                            </div>
                                            {
                                                (this.props.baseProduct !== null &&
                                                    this.props.baseProduct !== undefined &&
                                                    this.props.baseProduct !== "") ?
                                                    <>
                                                        <div className='row'>
                                                            <div className='col-12'>
                                                                <span>
                                                                    {t("Tank_Details_Label")}: {t("Overall_Capacity_Label")} {overAllCapacity} {uom} | {t("Inventory_Label")}: {inventory} {uom}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            {
                                                                this.props.validationErrors.Tanks !== "" ?
                                                                    <div className='col-12 below-text'>
                                                                        <span className='ui error-message'>{t(this.props.validationErrors.Tanks)}</span>
                                                                    </div> : null
                                                            }
                                                            <div className='col-12'>
                                                                <DataTable
                                                                    data={this.props.tanks}
                                                                    lazy={true}
                                                                    scrollable={true}
                                                                    className='tank-grid-product-forecast'
                                                                    scrollHeight="173px"
                                                                    showHeader={true}
                                                                    selection={this.props.selectedTanks}
                                                                    onSelectionChange={this.props.onTankSelection}
                                                                    onSelectAll={this.props.onTankSelection}
                                                                    selectionMode={"multiple"}
                                                                >
                                                                    <DataTable.Column
                                                                        field='Code'
                                                                        header={t("TankCode")}
                                                                        renderer={(cellData) => {
                                                                            return (
                                                                                <Tooltip
                                                                                    element={
                                                                                        <span
                                                                                            style={{
                                                                                                color: (cellData.rowData.Active ? "#14b614" : "red")
                                                                                            }}>
                                                                                            {cellData.value}
                                                                                        </span>
                                                                                    }
                                                                                    hover={true}
                                                                                    event="hover"
                                                                                    content={t(cellData.rowData.Active ? "ProductForecast_ActiveTank" : "ProductForecast_InactiveTank")}
                                                                                />
                                                                            );
                                                                        }} />
                                                                    <DataTable.Column field='GrossQuantity' header={t("ProductForecast_Inventory", [uom])} />
                                                                    <DataTable.Column field='Capacity' header={t("ProductForecast_Capacity", [uom])} />
                                                                    <DataTable.Column
                                                                        field='TankMode'
                                                                        header={t("TankInfo_Mode")}
                                                                        renderer={(cellData) => t(cellData.value)} />
                                                                </DataTable>
                                                            </div>
                                                        </div>
                                                    </> : null
                                            }
                                        </div>
                                        {
                                            this.props.isChartDataReady ?
                                                <div className='col-12 col-md-12 col-lg-7 col-xxl-8'>
                                                    <DashboardCard
                                                        header={t("ProductDemandForecast_ForecastOverview")}
                                                        childCount={0}
                                                        isExportRequired={false}
                                                        className="product-forecast-chart">
                                                        <LACSeriesChart
                                                            kpiInfo={this.fetchChartConfiguration(t, tolerance, uom, overAllCapacity)}
                                                            setChartRefs={this.setRefs}
                                                        />
                                                    </DashboardCard>
                                                </div> : (
                                                    this.props.isLoading ?
                                                        <div className='col-12 col-md-12 col-lg-7 col-xxl-8'>
                                                            <LoadingPage message="Loading" />
                                                        </div>
                                                        : null
                                                )
                                        }
                                    </div>
                                    {
                                        this.props.isChartDataReady ?
                                            <div className='row'>
                                                <div className='col-12 col-md-12 col-lg-6'>
                                                    <span>
                                                        {t(
                                                            "ProductDemandForecastGridHeader",
                                                            [
                                                                Utilities.DateDiffInDays(currentDate, this.props.endDate),
                                                                this.props.baseProduct,
                                                                currentDate.toLocaleDateString(),
                                                                this.props.endDate.toLocaleDateString()
                                                            ]
                                                        )}
                                                    </span>
                                                </div>
                                                <div className='col-12 col-md-12 col-lg-6'>
                                                    <span style={{ float: "right", fontStyle: "italic", color: "#a0a0a0" }}>
                                                        {t("ProductDemandForecastDisclaimer")}
                                                    </span>
                                                </div>
                                                <div className='col-12'>
                                                    <DataTable
                                                        data={this.props.forecastDetails}
                                                        lazy={true}
                                                        scrollable={true}
                                                        scrollHeight={"300px"}
                                                        showHeader={true}
                                                        className="forecast-details-table"
                                                        columnResizeMode="fit"
                                                        resizableColumns={true}
                                                    >
                                                        <DataTable.Column field='ForecastDate' header={t("ProductForecast_Date")} />
                                                        <DataTable.Column field='OpenInventory' header={t("ProductForecast_OpeningInventory", [uom])} />
                                                        <DataTable.Column field='OpenUllage' header={t("ProductForecast_OpeningUllage", [uom])} />
                                                        <DataTable.Column field='PlannedReceiptQty' header={t("ProductForecast_PlannedReceipts", [uom])} />
                                                        <DataTable.Column
                                                            field='ShipQtyDemand'
                                                            header={t("ProductForecast_PlannedShipments", [uom])}
                                                            renderer={(cellData) => {
                                                                let icon = null;
                                                                if (cellData.value > cellData.rowData.OpenInventory) {
                                                                    icon = <Icon root='building' className='pr-2' name="close-circled" size="small" color='red' />
                                                                }
                                                                else if ((cellData.value + Number(tolerance)) > cellData.rowData.OpenInventory) {
                                                                    icon = <Icon name="badge-warning" className='pr-2' color="yellow" size="small" />
                                                                }
                                                                else {
                                                                    icon = <Icon root="common" name='badge-check' className='pr-2' size="small" color="green" />
                                                                }

                                                                return (
                                                                    <span>
                                                                        {icon}
                                                                        {cellData.value}
                                                                    </span>
                                                                )
                                                            }} />
                                                        <DataTable.Column field='CloseInventory' header={t("ProductForecast_ClosingInventory", [uom])} />
                                                        <DataTable.Column field='CloseUllage' header={t("ProductForecast_ClosingUllage", [uom])} />
                                                        {
                                                            this.props.isSlotEnabled ?
                                                                <DataTable.Column
                                                                    field='ROADSlots'
                                                                    header={
                                                                        <span>
                                                                            {t("ProductForecast_SlotAvailability")}
                                                                            <span className='px-1' style={{ fontSize: "8px" }}>({t("Common_Receipts")})</span>
                                                                        </span>
                                                                    }
                                                                    renderer={(cellData) => {
                                                                        let roadColor = (cellData.rowData.ROADSlots === 0 ? "red" : "inherit");
                                                                        let marineColor = (cellData.rowData.MarineSlots === 0 ? "red" : "inherit");
                                                                        return (
                                                                            <span>
                                                                                <span
                                                                                    className='icon-Road'
                                                                                    style={{ color: roadColor }}></span>
                                                                                <span
                                                                                    className='pl-1'
                                                                                    style={{ color: roadColor }}>
                                                                                    {t("Common_Truck")}
                                                                                </span>
                                                                                <span> | </span>
                                                                                <span
                                                                                    className='icon-Marine'
                                                                                    style={{ color: marineColor }}>
                                                                                </span>
                                                                                <span
                                                                                    className='pl-1'
                                                                                    style={{ color: marineColor }}>
                                                                                    {t("Marine")}
                                                                                </span>
                                                                            </span>
                                                                        )
                                                                    }}
                                                                /> : null
                                                        }
                                                    </DataTable>
                                                </div>
                                            </div> : (
                                                this.props.isLoading ?
                                                    <div className='row'>
                                                        <div className='col-12'>
                                                            <LoadingPage message="Loading" />
                                                        </div>
                                                    </div>
                                                    : null
                                            )
                                    }
                                </div>
                            )
                        }
                    </TranslationConsumer>
                </ErrorBoundary>
            </div >
        );
    }
}

ProductDemandForecastingDetailsComposite.propTypes = {
    baseProductsList: PropTypes.arrayOf(PropTypes.object).isRequired,
    terminal: PropTypes.string.isRequired,
    baseProduct: PropTypes.string.isRequired,
    endDate: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,
    tanks: PropTypes.arrayOf(PropTypes.object).isRequired,
    configuration: PropTypes.object.isRequired,
    onGoClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    forecastDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
    isChartDataReady: PropTypes.bool
}

ProductDemandForecastingDetailsComposite.defaultProps = {
    isChartDataReady: false,
    isLoading: false
}

const mapStateToProps = (state) => {
    return {
        userDetails: state.getUserDetails.userDetails,
        tokenDetails: state.getUserDetails.TokenAuth,
    };
};

export default connect(mapStateToProps)(ProductDemandForecastingDetailsComposite);