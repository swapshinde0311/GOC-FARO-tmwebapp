import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import KPIDashboardLayout from "../Common/KPIDashboard/KPIDashboardLayout";
import ErrorBoundary from "../../ErrorBoundary";
import { TranslationConsumer } from "@scuf/localization";
export default function TMDetailsKPILayout({
    KPIList,
    pageName,
    rowHeight,
    widgetHeight,
    isDraggable,
    isResizable,
    kpiDisplayTopBreakpoint
}) {
    const [KPIDisplays, setKPIDisplays] = useState(1);

    const kpiDiv = React.useRef(null);

    const hideKpis = () => {
        let currentScrollPos = window.pageYOffset;
        let KPIDisplay = KPIDisplays;

        // hide kpis based on div position to top of the window 
        if (kpiDiv.current && kpiDiv.current.getBoundingClientRect().top < kpiDisplayTopBreakpoint) {
            KPIDisplay = 0;
        }
        // show the kpis once at top of the screen
        else if (currentScrollPos === 0) {
            KPIDisplay = 1
        }
        else {
            return;
        }

        setKPIDisplays(KPIDisplay);
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", hideKpis);
        }
    });


    useEffect(() => {
        // remove listener on unmount
        return () => {
            window.removeEventListener("scroll", hideKpis)
        }

    }, []);

    return (
        <div ref={kpiDiv}>
            {KPIDisplays === 1 ? <TranslationConsumer>
                {(t) => (
                    <div style={{ marginTop: "6px" }}>
                        <ErrorBoundary>
                            <KPIDashboardLayout
                                kpiList={KPIList}
                                isDraggable={isDraggable}
                                isResizable={isResizable}
                                rowHeight={rowHeight}
                                widgetHeight={widgetHeight}
                                pageName={pageName}
                            ></KPIDashboardLayout>
                        </ErrorBoundary>
                    </div>

                )}
            </TranslationConsumer> : ""}
        </div>
    )
}

TMDetailsKPILayout.propTypes = {
    kpiDisplayTopBreakpoint: PropTypes.number
}

TMDetailsKPILayout.defaultProps = {
    kpiDisplayTopBreakpoint: 100
}