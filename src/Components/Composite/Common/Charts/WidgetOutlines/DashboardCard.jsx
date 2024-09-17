import { Icon, Modal, Popup, Tooltip, VerticalMenu } from '@scuf/common';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../ErrorBoundary';
import { TranslationConsumer } from '@scuf/localization';

const DashboardCard = (props) => {
    const [cardPreview, setCardPreview] = useState(false);

    const [isLive, setIsLive] = useState(false);

    // add additional props to child elements
    const childrenWithProps = React.Children.map((props.children), child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child,
                {
                    // check if widget represents live data
                    isLiveCheck: (isLive) => {
                        setIsLive((typeof isLive !== "boolean") ? false : isLive)
                    }
                })
        }

        return child;
    })

    return (
        <ErrorBoundary>
            <TranslationConsumer>
                {(t) =>
                    <React.Fragment>
                        <div className={"dashboardCard " + props.className}>
                            <div className="dashboardCardHeader pl-0">
                                <div className='pl-2 pt-1' style={{ float: "left", width: "60%" }}>
                                    <Tooltip
                                        content={t(props.header)}
                                        element={
                                            <h4 style={{
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}>
                                                {t(props.header)}
                                            </h4>
                                        }
                                        hoverable={true}
                                        event='hover'
                                    />
                                </div>
                                <div style={{ float: "right" }}>
                                    {isLive ?
                                        <span className='px-2'>
                                            <span
                                                className='icon-Live'
                                                style={{ fontSize: "16px", verticalAlign: "middle" }}>
                                            </span>
                                        </span>
                                        : null
                                    }
                                    {props.isExportRequired ?
                                        <Popup
                                            element={
                                                <Tooltip
                                                    content={t("Chart_Download")}
                                                    element={
                                                        <span className='px-2' style={{ padding: "10px" }}>
                                                            <Icon root="common" name="file-download" className='dashboardIcon' size="small" />
                                                        </span>
                                                    }
                                                    hoverable={true}
                                                    event='hover'
                                                />
                                            }
                                            on="click">
                                            <VerticalMenu>
                                                <VerticalMenu.Item onClick={() => props.exportHandler(props.exportName, "png")}>PNG</VerticalMenu.Item>
                                                <VerticalMenu.Item onClick={() => props.exportHandler(props.exportName, "jpeg")}>JPEG</VerticalMenu.Item>
                                                <VerticalMenu.Item onClick={() => props.exportHandler(props.exportName, "svg")}>SVG</VerticalMenu.Item>
                                            </VerticalMenu>
                                        </Popup> : null
                                    }
                                    {
                                        props.isFullScreenRequired ?
                                            <Tooltip
                                                content={t("Chart_Fullscreen")}
                                                element={
                                                    <span
                                                        className='px-2'
                                                        style={{ "cursor": "pointer" }}
                                                        onClick={() => {
                                                            setCardPreview(true)
                                                            // if any operation to executed when widget is shown in full-screen
                                                            if (props.fullScreenHandler)
                                                                props.fullScreenHandler(true);
                                                        }}>
                                                        <Icon root='common' name="enter-fullscreen" size="small" className='dashboardIcon' />
                                                    </span>}
                                                hoverable={true}
                                                event='hover'
                                            /> : null
                                    }
                                    {
                                        !isNaN(parseInt(props.childCount)) && parseInt(props.childCount) > 0 ?
                                            <Tooltip
                                                content={t("More_Details")}
                                                element={
                                                    <span className='px-2' style={{ "cursor": "pointer" }} onClick={props.clickHandler}>
                                                        <Icon root="common" className='dashboardIcon' name="caret-right" size="small" />
                                                    </span>}
                                                hoverable={true}
                                                event='hover'
                                            />
                                            : null
                                    }
                                </div>
                            </div>
                            <div className="dashboardCardContent">
                                {!cardPreview ? childrenWithProps : null}
                            </div>
                        </div>
                        {
                            cardPreview ?
                                (
                                    <Modal
                                        open={cardPreview}
                                        size="large"
                                        className='cardDetailsPopup'
                                        closeOnDimmerClick={false}
                                        closeOnDocumentClick={false}
                                        onClose={() => {
                                            setCardPreview(false)
                                            // if any operation to executed when full-screen is closed 
                                            if (props.fullScreenHandler)
                                                props.fullScreenHandler(false);
                                        }}
                                        closeIcon={true}>
                                        <Modal.Header>
                                            {t(props.header)}
                                            {props.isExportRequired ?
                                                <Popup
                                                    element={
                                                        <Tooltip
                                                            content={t("Download")}
                                                            element={
                                                                <span className='pl-3' style={{ padding: "10px" }}>
                                                                    <Icon root="common" name="file-download" size="small" />
                                                                </span>
                                                            }
                                                            hoverable={true}
                                                            event='hover'
                                                        />
                                                    }
                                                    on="click">
                                                    <VerticalMenu>
                                                        <VerticalMenu.Item onClick={() => props.exportHandler(props.exportName, "png")}>PNG</VerticalMenu.Item>
                                                        <VerticalMenu.Item onClick={() => props.exportHandler(props.exportName, "jpeg")}>JPEG</VerticalMenu.Item>
                                                        <VerticalMenu.Item onClick={() => props.exportHandler(props.exportName, "svg")}>SVG</VerticalMenu.Item>
                                                    </VerticalMenu>
                                                </Popup> : null
                                            }
                                        </Modal.Header>
                                        <Modal.Content>
                                            {childrenWithProps}
                                        </Modal.Content>
                                    </Modal>
                                ) : null
                        }
                    </React.Fragment>

                }
            </TranslationConsumer>
        </ErrorBoundary >
    )
}

DashboardCard.propTypes = {
    header: PropTypes.string.isRequired,
    childCount: PropTypes.number.isRequired,
    clickHandler: PropTypes.func,
    exportHandler: PropTypes.func,
    exportName: PropTypes.string,
    children: PropTypes.element,
    menuItems: PropTypes.array,
    fullScreenHandler: PropTypes.func,
    className: PropTypes.string,
    isExportRequired: PropTypes.bool,
    isFullScreenRequired: PropTypes.bool
}

DashboardCard.defaultProps = {
    exportName: "Chart",
    menuItems: [],
    className: "",
    isExportRequired: true,
    isFullScreenRequired: true
}

export default DashboardCard