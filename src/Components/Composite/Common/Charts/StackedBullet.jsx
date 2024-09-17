import React from 'react';
import { TranslationConsumer } from '@scuf/localization';
import { connect } from 'react-redux';
import ErrorBoundary from '../../../ErrorBoundary';
import { ThemeType, Tooltip } from '@scuf/common';

const StackedBullet = (props) => {

    const stackedBulletRef = React.useRef(null);

    const jsonData = JSON.parse(props.kpiInfo.JSONFormat);

    React.useEffect(() => {
        if (props.setChartRefs) {
            props.setChartRefs(props.kpiInfo.KPIName, stackedBulletRef, props.kpiInfo.Sequence);
        }

        if (props.isLiveCheck) {
            props.isLiveCheck(jsonData.Chart.ChartDetails.isLive);
        }
    }, [stackedBulletRef]);

    return (
        <ErrorBoundary>
            <TranslationConsumer>
                {(t) => (
                    <div ref={stackedBulletRef} className='p-2 dashboardCharts stacked-bullet-chart'>
                        <div className='vertical-align-charts'>
                            {
                                jsonData.Chart.ChartDetails.bullets.map((row, index) => {
                                    // check if data is available
                                    if (Array.isArray(props.kpiInfo.KPIData[row.tableName])) {
                                        const labels = [];
                                        let colSum = 0;

                                        if (props.kpiInfo.KPIData[row.tableName].length !== 0) {
                                            colSum = row.sections.map(section => props.kpiInfo.KPIData[row.tableName][0][section.dbColumn]).reduce((a, b) => a + b);

                                            row.sections.forEach(section => {
                                                labels.push(
                                                    <Tooltip
                                                        content={props.kpiInfo.KPIData[row.tableName][0][section.dbColumn] + " " + t(section.toolTip ? section.toolTip : section.label)}
                                                        element={
                                                            <div
                                                                style={{
                                                                    width: colSum !== 0 ? `${Math.round((props.kpiInfo.KPIData[row.tableName][0][section.dbColumn] / colSum) * 10000) / 100}%` : 0,
                                                                    padding: "0px 0.75px"
                                                                }}
                                                                className='stack-bullet-label'
                                                            >
                                                                <div className='stack-bullet-label'>
                                                                    {props.kpiInfo.KPIData[row.tableName][0][section.dbColumn]} {t(section.label)}
                                                                </div>
                                                                <div
                                                                    className='stackedBullets'
                                                                    style={{
                                                                        backgroundColor: props.theme === ThemeType.Dark && section.color.dark ?
                                                                            section.color.dark : section.color.default
                                                                    }}>
                                                                </div>
                                                            </div>
                                                        }
                                                        event='hover'
                                                    />
                                                );
                                            });
                                        }

                                        return (
                                            <div
                                                key={"stacked_bullet" + props.kpiInfo.KPIName + String(index)}
                                                className={'vertical-align-center' + (index !== 0 ? " mt-2" : "")}>
                                                <div style={{ "width": "35%" }}>
                                                    <div style={{ "display": "flex" }}>
                                                        <h1 className='p-2 vertical-align-center mb-0'>
                                                            {props.kpiInfo.KPIData[row.tableName].length === 0 ? 0 : props.kpiInfo.KPIData[row.tableName][0][row.totalValDbCol]}
                                                        </h1>
                                                        <span className='my-2 pr-2 my-auto vertical-align-center stacked-bullet-header'>
                                                            {t(row.header)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='pl-2' style={{ "width": "65%" }}>
                                                    <div style={{ display: "flex" }}>
                                                        {labels}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return null;
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

export default connect(mapStateToProps)(StackedBullet)