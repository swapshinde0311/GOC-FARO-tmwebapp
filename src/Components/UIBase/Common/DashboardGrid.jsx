import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import '../../../CSS/dashboardGrid/react-grid-layout.css';
import '../../../CSS/dashboardGrid/react-resizable.css';
import PropTypes from 'prop-types';


// WidthProvider HOC automatically calculates the width
const ResponsiveGridLayout = WidthProvider(Responsive);


const DashboardGrid = (props) => {
    // screenWidth is used to calculate the number of widgets per row and their positions
    let screenWidth = window.screen.width;

    let yPosFactor = 1;

    // layout is used to provide the grid layout if available in localStorage
    const [layout, setLayout] = React.useState(
        JSON.parse(JSON.stringify(
            getFromLS(props.pageName + "layouts") || {}
        )));

    // store the changed layout
    const onLayoutChange = (layout, layouts) => {
        saveToLS(props.pageName + "layouts", layouts);
        setLayout(
            layouts
        );
    };

    return (
        <div className='col-12 p-0'>
            <ResponsiveGridLayout
                className="layout"
                // configure screen width breakpoints
                breakpoints={{
                    lg: 1300,
                    md: 950,
                    sm: 768,
                    xs: 480,
                    xxs: 0
                }}
                // configure number of columns for each screen width breakpoint
                cols={props.cols}
                layouts={layout}
                isDraggable={props.isDraggable}
                isResizable={props.isResizable}
                rowHeight={props.rowHeight}
                onLayoutChange={(layout, layouts) =>
                    onLayoutChange(layout, layouts)
                }
            >
                {
                    props.children.map((item, index) => {
                        let dimensions = item.props.dimensions;
                        let x = 0;
                        let y = 0;
                        // calculate the x, y positions based on screen size
                        if (screenWidth <= 480) {
                            x = 1;
                            y = index;
                        } else if (screenWidth <= 768) {
                            x = index % 2;
                            // y = index * 1;
                            if (index >= 2 * (yPosFactor)) {
                                yPosFactor += 1;
                            }

                            y = yPosFactor;
                        } else if (screenWidth <= 1600) {
                            x = index % 3;
                            if (index >= 3 * (yPosFactor)) {
                                yPosFactor += 1;
                            }

                            y = yPosFactor;
                        } else {
                            x = index % 4;
                            if (index >= 4 * (yPosFactor)) {
                                yPosFactor += 1;
                            }

                            y = yPosFactor;
                        }

                        return (
                            <div
                                style={{ height: "100%" }}
                                key={`${index}`}
                                data-grid={{
                                    x: x,
                                    y: y,
                                    w: dimensions ? dimensions.width : 1,
                                    h: dimensions ? dimensions.height : props.widgetHeight
                                }}
                            >
                                {item}
                            </div>
                        );
                    })
                }
            </ResponsiveGridLayout>
        </div >
    );
}

function getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
        } catch (e) {
            console.log("Error fetching grid layout: ", e)
        }
    }
    return ls[key];
}

function saveToLS(key, value) {
    if (global.localStorage) {
        global.localStorage.setItem(
            "rgl-8",
            global.localStorage.getItem("rgl-8") ? JSON.stringify({
                ...JSON.parse(global.localStorage.getItem("rgl-8")),
                [key]: value
            })
                :
                JSON.stringify({
                    [key]: value
                })
        );
    }
}

DashboardGrid.propTypes = {
    isDraggable: PropTypes.bool,
    isResizable: PropTypes.bool,
    rowHeight: PropTypes.number,
    widgetHeight: PropTypes.number,
    pageName: PropTypes.string.isRequired,
    cols: PropTypes.object
}

DashboardGrid.defaultProps = {
    isDraggable: false,
    isResizable: false,
    rowHeight: 125,
    widgetHeight: 2,
    cols: { lg: 4, md: 3, sm: 2, xs: 2, xxs: 1 }
}

export default DashboardGrid;