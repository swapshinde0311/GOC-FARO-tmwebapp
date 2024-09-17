import React from 'react';
import { TranslationConsumer } from '@scuf/localization';
import ErrorBoundary from '../../../ErrorBoundary';
const BlockChart = (props) => {

    const blockChartRef = React.useRef(null);

    const jsonData = JSON.parse(props.kpiInfo.JSONFormat);

    React.useEffect(() => {
        if (props.setChartRefs) {
            props.setChartRefs(props.kpiInfo.KPIName, blockChartRef, props.kpiInfo.Sequence);
        }

        if (props.isLiveCheck) {
            props.isLiveCheck(jsonData.Chart.ChartDetails.isLive);
        }
    }, [blockChartRef]);


    return (
        <ErrorBoundary>
            <TranslationConsumer>
                {
                    (t) => (
                        <div ref={blockChartRef} className='dashboardCharts p-3 blockChart'>
                            <div className='vertical-align-charts'>
                                <div className='row'>
                                    {
                                        jsonData.Chart.ChartDetails.Blocks.map((block, index) => {
                                            let colClass = "col";
                                            if (parseInt(jsonData.Chart.ChartDetails.Columns) === 1)
                                                colClass = "col-12";
                                            else if (parseInt(jsonData.Chart.ChartDetails.Columns) === 2)
                                                colClass = "col-6";
                                            else if (parseInt(jsonData.Chart.ChartDetails.Columns) === 3)
                                                colClass = "col-4"
                                            else if (parseInt(jsonData.Chart.ChartDetails.Columns) === 4)
                                                colClass = "col-3";

                                            return (
                                                <div
                                                    key={"block" + String(index)}
                                                    className={colClass}>
                                                    <div className="" style={{ display: "flex" }}>
                                                        <h1 className="mb-0">
                                                            {t(props.kpiInfo.KPIData[jsonData.Chart.ChartDetails.TableName][0][block.ColName])}
                                                        </h1>
                                                        <span className='my-2 px-2 block-chart-label mt-auto'>
                                                            {t(block.localeKey)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    )
                }
            </TranslationConsumer>
        </ErrorBoundary>
    )
}

export default BlockChart