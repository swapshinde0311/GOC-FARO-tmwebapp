import React from 'react';
import { TranslationConsumer } from '@scuf/localization';
import ErrorBoundary from '../../../ErrorBoundary';
import { LinearGauge, RadialGauge, Range } from '@grapecity/wijmo.react.gauge';
import { ThemeType } from "@scuf/common"
import { connect } from 'react-redux';

const GaugeChart = (props) => {
    const ref = React.useRef(null);
    const jsonData = JSON.parse(props.kpiInfo.JSONFormat);

    const gauge = React.useRef(null);

    React.useEffect(() => {
        if (props.setChartRefs) {
            props.setChartRefs(props.kpiInfo.KPIName, ref, props.kpiInfo.Sequence);
        }

        if (props.isLiveCheck) {
            props.isLiveCheck(jsonData.Chart.ChartDetails.isLive);
        }
    }, [ref]);

    const renderRanges = (t) => {
        const maxVal = props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Max];
        // return ranges if configured
        return (
            jsonData.Chart.ChartDetails.ranges &&
                Array.isArray(jsonData.Chart.ChartDetails.ranges) ?
                jsonData.Chart.ChartDetails.ranges.map((range, index) => {
                    let color = (range.color !== null && typeof range.color === 'object') ?
                        (
                            props.theme === ThemeType.Dark && range.color.dark ?
                                range.color.dark :
                                range.color.default
                        )
                        : range.color;
                    return (
                        <Range
                            key={index}
                            // min value configured in json will be considered as percentage value
                            min={(range.min / 100) * maxVal}
                            // max value configured in json will be considered as percentage value
                            max={(range.max / 100) * maxVal}
                            color={color}
                            name={t(range.name)} />
                    );
                })
                : null
        )
    }

    // corresponds to gauge fill color and width
    const renderPoints = (t) => {
        const pointer = jsonData.Chart.ChartDetails.pointer;
        return (
            pointer ?
                <Range
                    wjProperty="pointer"
                    min={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Min]}
                    max={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Max]}
                    {...pointer}
                    color={
                        pointer.color ?
                            (
                                props.theme === ThemeType.Dark && pointer.color.dark ?
                                    pointer.color.dark :
                                    pointer.color.default
                            )
                            : null
                    }></Range>
                : ""
        )
    }

    // corresponds to gauge background color and width
    const renderFace = (t) => {
        const face = jsonData.Chart.ChartDetails.face
        return (
            face ?
                <Range
                    wjProperty="face"
                    {...face}
                    min={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Min]}
                    max={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Max]}
                    color={
                        face.color ?
                            (
                                props.theme === ThemeType.Dark && face.color.dark ?
                                    face.color.dark :
                                    face.color.default
                            )
                            : null
                    }>
                </Range>
                : null
        )
    }

    // refresh gauge when theme changes
    React.useEffect(() => {
        if (gauge.current) {
            gauge.current.refresh();
        }
    }, [props.theme])

    return (
        <ErrorBoundary>
            <TranslationConsumer>
                {
                    (t) => (
                        <div
                            ref={ref}
                            className='wijmoCharts'
                            style={{
                                "display": "flex",
                                "alignItems": "center"
                            }}>
                            {
                                jsonData.Chart.ChartDetails.common.gaugeType === "Linear" ?
                                    <LinearGauge
                                        {...jsonData.Chart.ChartDetails.common}
                                        autoScale={true}
                                        initialized={(sender) => { gauge.current = sender }}
                                        min={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Min]}
                                        max={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Max]}
                                        value={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Value]}>
                                        {renderPoints(t)}
                                        {renderFace(t)}
                                        {renderRanges(t)}
                                    </LinearGauge> :
                                    (
                                        jsonData.Chart.ChartDetails.common.gaugeType === "Radial" ?
                                            <RadialGauge
                                                {...jsonData.Chart.ChartDetails.common}
                                                autoScale={true}
                                                initialized={(sender) => { gauge.current = sender }}
                                                min={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Min]}
                                                max={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Max]}
                                                value={props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.bindings.TableName][0][jsonData.Chart.ChartDetails.bindings.Value]}>
                                                {renderPoints(t)}
                                                {renderFace(t)}
                                                {renderRanges(t)}
                                            </RadialGauge>
                                            : null
                                    )
                            }
                        </div>
                    )
                }
            </TranslationConsumer>
        </ErrorBoundary>
    )
}

const mapStateToProps = (state) => {
    return {
        theme: state.appTheme.theme
    }
}

export default connect(mapStateToProps)(GaugeChart);