import React from 'react';
import { TranslationConsumer } from '@scuf/localization';
import ErrorBoundary from '../../../ErrorBoundary';
import { ThemeType } from "@scuf/common"
import { connect } from 'react-redux';

const BulletChart = (props) => {

    const ref = React.useRef(null);
    const jsonData = JSON.parse(props.kpiInfo.JSONFormat);
    React.useEffect(() => {
        if (props.setChartRefs) {
            props.setChartRefs(props.kpiInfo.KPIName, ref, props.kpiInfo.Sequence);
        }

        if (props.isLiveCheck) {
            props.isLiveCheck(jsonData.Chart.ChartDetails.isLive);
        }
    }, [ref]);

    return (
        <ErrorBoundary>
            <TranslationConsumer>
                {(t) => (
                    <div ref={ref}
                        className='dashboardCharts bulletChart pt-3'>
                        <div className='vertical-align-charts'>
                            {props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName].map((row, index) => {
                                let fillPercent = (((row[jsonData.Chart.ChartDetails.bindings.Max] - row[jsonData.Chart.ChartDetails.bindings.Min]) === 0)
                                    || (row[jsonData.Chart.ChartDetails.bindings.Max] < row[jsonData.Chart.ChartDetails.bindings.Min])) ?
                                    0 :
                                    row[jsonData.Chart.ChartDetails.bindings.Current] /
                                    (row[jsonData.Chart.ChartDetails.bindings.Max] - row[jsonData.Chart.ChartDetails.bindings.Min])
                                    * 100;

                                // if 'FillColor' is unavailable, obtain color from ranges
                                let fillColor =
                                    jsonData.Chart.ChartDetails.bindings.FillColor ?
                                        JSON.parse(row[jsonData.Chart.ChartDetails.bindings.FillColor])
                                        : jsonData.Chart.ChartDetails.ranges.filter(range => fillPercent >= range.min && fillPercent <= range.max)[0].color

                                return (
                                    <div className={"row" + (index !== 0 ? " mt-3" : "")} >
                                        {
                                            row[jsonData.Chart.ChartDetails.bindings.Name] ?
                                                <div className='col-12 pb-1' style={{ textAlign: "center" }}>
                                                    {t(row[jsonData.Chart.ChartDetails.bindings.Name])}
                                                </div>
                                                : null
                                        }
                                        <div className='col-3 pr-0' style={{ textAlign: "right" }}>
                                            {row[jsonData.Chart.ChartDetails.bindings.Current]} {row[jsonData.Chart.ChartDetails.bindings.Unit]}
                                        </div>
                                        <div className='col-6'>
                                            <div
                                                className='bullet'
                                                style={{
                                                    backgroundColor: row[jsonData.Chart.ChartDetails.bindings.BackgroundColor]
                                                }}>
                                                <div
                                                    style={{
                                                        width: `${fillPercent}%`,
                                                        maxWidth: "100%",
                                                        minWidth: "0"
                                                    }}>
                                                    <div
                                                        className='filledBullet'
                                                        style={{
                                                            backgroundColor:
                                                                (
                                                                    props.theme === ThemeType.Dark && fillColor.dark ?
                                                                        fillColor.dark :
                                                                        fillColor.default
                                                                )
                                                        }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-3 pl-0'>
                                            {row[jsonData.Chart.ChartDetails.bindings.Max]} {row[jsonData.Chart.ChartDetails.bindings.Unit]}
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                )}
            </TranslationConsumer>
        </ErrorBoundary>
    )
}

const mapStateToProps = (state) => {
    return {
        theme: state.appTheme.theme
    }
}

export default connect(mapStateToProps)(BulletChart);