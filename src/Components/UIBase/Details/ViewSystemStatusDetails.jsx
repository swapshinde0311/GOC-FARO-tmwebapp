import React from "react";
import { useTranslation } from "@scuf/localization";
import { InputLabel, Accordion, Button } from "@scuf/common";
import { DataTable } from "@scuf/datatable";
import PropTypes from "prop-types";
import AccordionContent from "@scuf/common/dist/components/Accordion/Content/Content";

ViewSystemStatusDetails.propTypes = {
    lastUpdatedTime: PropTypes.object.isRequired,
    deviceCommunicationStatusData: PropTypes.array.isRequired,
    pageSize: PropTypes.object.isRequired,
    serverStatus: PropTypes.array.isRequired,
    isDCHEnable: PropTypes.bool.isRequired,
    externalSystemStatusData: PropTypes.array.isRequired,
    isArchiveEnable: PropTypes.bool.isRequired,
    lastArchivedTime: PropTypes.object.isRequired,
    isTWICEnable: PropTypes.bool.isRequired,
    twicRuntimeValue: PropTypes.object.isRequired,
    checkDeviceStatus: PropTypes.func.isRequired,
    terminalCommunicationStatusData: PropTypes.array.isRequired,
    isEnterpriseNode: PropTypes.bool.isRequired,
    serverStorageStatus: PropTypes.array.isRequired
}

ViewSystemStatusDetails.defaultProps = {
    isDCHEnable: false,
    isArchiveEnable: false,
    isTWICEnable: false,
    isEnterpriseNode: false
}

export function ViewSystemStatusDetails({
    lastUpdatedTime,
    deviceCommunicationStatusData,
    pageSize,
    serverStatus,
    isDCHEnable,
    externalSystemStatusData,
    isArchiveEnable,
    lastArchivedTime,
    isTWICEnable,
    twicRuntimeValue,
    checkDeviceStatus,
    terminalCommunicationStatusData,
    isEnterpriseNode,
    serverStorageStatus
}) {
    const [t] = useTranslation();

    const handleCheckNow = (cellData) => {
        return (
            <Button
                size="small"
                textTransform={false}
                onClick={() => checkDeviceStatus(cellData.rowData)}
                content={t("Communication_CheckNow")}
                disabled={!(cellData.rowData.btnCheck_Enabled)}
            ></Button>
        )
    }

    const handleProcessStatus = (cellData) => {
        if (cellData.rowData.ExeStatus !== null) {
            if (cellData.rowData.ExeStatus) {
                return (
                    <div>
                        <img
                            src="/GVcheck.png"
                            alt=""
                            title={t("Communication_OKtooltip")}
                        >
                        </img>
                    </div>
                )
            }
            else {
                return (

                    <div>
                        <img
                            src="/GVicon-cross.png"
                            alt=""
                            title={t("Communication_Lockedtooltip")}
                        >
                        </img>
                    </div>

                )
            }
        }
    }

    const handleCommunicationActive = (cellData) => {
        if (cellData.rowData.Active) {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/GVcheck.png"
                        alt=""
                        title={t("Communication_OKtooltip")}
                    >
                    </img>
                </div>
            )
        }
        else {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/GVicon-cross.png"
                        alt=""
                        title={t("Communication_Lockedtooltip")}
                    >
                    </img>
                </div>

            )
        }

    }

    const handleExternalSystemStatus = (cellData) => {
        if (cellData.rowData.Status) {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/GVLoading.gif"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t(cellData.rowData.Tooltip)}
                    >
                    </img>
                </div>
            )
        }
        else {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/i_Status_Fail.png"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t(cellData.rowData.Tooltip)}
                    >
                    </img>
                </div>
            )
        }
    }

    const handleServerStatus = (cellData) => {
        if (cellData.rowData.ServiceStaus === 0) {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/i_Status_Fail.png"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t("ServiceStatus_NotRunning")}
                    >
                    </img>
                </div>
            )
        }
        else if (cellData.rowData.ServiceStaus === 1) {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/GVLoading.gif"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t("ServiceStatus_Running")}
                    >
                    </img>
                </div>
            )
        }
        else if (cellData.rowData.ServiceStaus === 2) {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/i_Status_Fail.png"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t("ServiceStatus_NotRunning")}
                    >
                    </img>
                </div>
            )
        }
    }

    const handleCommunicationStatus = (cellData) => {
        if (cellData.rowData.CommStatus_Visible) {
            if (cellData.rowData.CommStatus === "True") {
                return (
                    <div className="communicationStatus-img">
                        <img
                            src="/GVLoading.gif"
                            alt=""
                            className="communicationStatusDot-img"
                            title={t(cellData.rowData.CommStatus_Tooltip)}
                        >
                        </img>
                    </div>
                )
            }
            else {
                return (
                    <div className="communicationStatus-img">
                        <img
                            src="/i_Status_Fail.png"
                            className="communicationStatusDot-img"
                            alt=""
                            title={t(cellData.rowData.CommStatus_Tooltip)}
                        >
                        </img>
                    </div>
                )
            }
        }
    }

    const handleRunningStatus = (cellData) => {
        if (cellData.rowData.RunningStatus_Visible) {
            if (cellData.rowData.RunningStatus === "True") {
                return (
                    <div className="communicationStatus-img">
                        <img
                            src="/GVLoading.gif"
                            className="communicationStatusDot-img"
                            alt=""
                            title={t(cellData.rowData.RunningStatus_Tooltip)}
                        >
                        </img>
                    </div>
                )
            }
            else {
                return (
                    <div className="communicationStatus-img">
                        <img
                            src="/i_Status_Fail.png"
                            className="communicationStatusDot-img"
                            alt=""
                            title={t(cellData.rowData.RunningStatus_Tooltip)}
                        >
                        </img>
                    </div>
                )
            }
        }
    }

    const handleServiceColumn = (cellData) => {
        return (
            <DataTable
                data={cellData.rowData.ServiceName}
                showHeader={false}
            >
                <DataTable.Column
                    initialWidth="30%"
                    className="compColHeight"
                    key="ServiceName"
                    field="ServiceName"
                >
                </DataTable.Column>
            </DataTable>
        )
    }
    const handleRunningStatusColumn = (cellData) => {
        return (
            <DataTable
                data={cellData.rowData.ServiceStaus}
                showHeader={false}
            >
                <DataTable.Column
                    initialWidth="10%"
                    className="compColHeight"
                    renderer={handleServerStatus}>
                </DataTable.Column>
            </DataTable>
        )
    }

    const handleServerNameColumn = (cellData) => {
        if (cellData.rowData.ServerType === "EPKSSERVER") {
            return (
                <div>
                    <div>{cellData.rowData.ServerName}</div>
                    {
                        cellData.rowData.ListOfServerStatusInfo.map((serverData) =>
                            serverData.statusCode === 1 ? <div>
                                <img
                                    src="/GVLoading.gif"
                                    className="communicationStatusDot-img"
                                    alt=""
                                    title={t(serverData.ToolTip)}
                                >
                                </img>{serverData.Type}
                            </div> :
                                serverData.statusCode === 2 ?
                                    <div>
                                        <img
                                            src="/i_Status_Success.png"
                                            className="communicationStatusDot-img"
                                            alt=""
                                            title={t(serverData.ToolTip)}
                                        >
                                        </img>{serverData.Type}
                                    </div> : serverData.statusCode === 3 ?
                                        <div>
                                            <img
                                                src="/i_Status_Fail.png"
                                                className="communicationStatusDot-img"
                                                alt=""
                                                title={t(serverData.ToolTip)}
                                            >
                                            </img>{serverData.Type}
                                        </div> : ""
                        )
                    }
                </div>
            )
        }
        else {
            return (
                <div>{cellData.rowData.ServerName}</div>
            )
        }
    }

    const handleTerminalColumn = (cellData) => {
        if (cellData.rowData.TerminalStatus === "True") {
            return (
                <div>
                    <img
                        src="/GVLoading.gif"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t(cellData.rowData.TerminalStatus_Tooltip)}
                    >
                    </img>{cellData.rowData.TerminalCode}
                </div>
            )
        }
        else {
            return (
                <div>
                    <img
                        src="/i_Status_Fail.png"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t(cellData.rowData.TerminalStatus_Tooltip)}
                    >
                    </img>{cellData.rowData.TerminalCode}
                </div>
            )

        }
    }

    const handleTerminalProcessEnable = (cellData) => {
        if (cellData.rowData.ProcessEnableStauts === "True") {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/GVcheck.png"
                        alt=""
                        title={t(cellData.rowData.ProcessEnableStauts_Tooltip)}
                    >
                    </img>
                </div>
            )
        }
        else {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/GVicon-cross.png"
                        alt=""
                        title={t(cellData.rowData.ProcessEnableStauts_Tooltip)}
                    >
                    </img>
                </div>
            )
        }
    }

    const handleTerminalProcessStatus = (cellData) => {
        if (cellData.rowData.ProcessRunningStatus === "True") {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/GVLoading.gif"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t(cellData.rowData.RunningStatus_Tooltip)}
                    >
                    </img>
                </div>
            )
        }
        else {
            return (
                <div className="communicationStatus-img">
                    <img
                        src="/i_Status_Fail.png"
                        className="communicationStatusDot-img"
                        alt=""
                        title={t(cellData.rowData.RunningStatus_Tooltip)}
                    >
                    </img>
                </div>
            )
        }
    }

    const handleDBDiskRender = (cellData) => {
        return (
            <React.Fragment>
                {
                    Object.keys(cellData.rowData.StorageDetails).map(key => {
                        return (
                            <DataTable
                                data={cellData.rowData.StorageDetails[key]}
                                showHeader={true}>
                                <DataTable.Column
                                    renderer={(rowData) => {
                                        return (
                                            <div className="mt-1">
                                                <img
                                                    src={rowData.rowData.Color === "red" ? "/i_Status_Fail.png" : "/i_Status_Success.png"}
                                                    className="communicationStatusDot-img"
                                                    alt=""
                                                    title={t(cellData.rowData.RunningStatus_Tooltip)}
                                                >
                                                </img>
                                                <span>{rowData.rowData.Name}</span>
                                            </div>
                                        )
                                    }}
                                    header={t(key)}
                                >
                                </DataTable.Column>
                                <DataTable.Column
                                    renderer={(rowData) => rowData.rowData.Value}
                                    header={t(key + "_ColumnValue")}></DataTable.Column>
                            </DataTable>
                        )
                    })
                }
            </React.Fragment>
        );
    }

    return (
        <div>
            <div className="headerContainer">
                <div className="row headerSpacing">
                    <div className="col-12 pb-0">
                        <div style={{ float: "right" }}>{t("Common_LastUpdated") + " : " + lastUpdatedTime}</div>
                    </div>
                </div>
            </div>
            <div className="detailsContainer">
                {
                    (isEnterpriseNode) ? (
                        <Accordion>
                            <AccordionContent
                                className="attributeAccordian"
                                title={t("TerminalCommStatus_Title")}
                            >
                                <div className="col-8 detailsTable">
                                    <DataTable
                                        data={terminalCommunicationStatusData}
                                        search={true}
                                        searchPlaceholder={t("LoadingDetailsView_SearchGrid")}>
                                        <DataTable.Column
                                            initialWidth="10%"
                                            className="compColHeight"
                                            header={t("BaseProductList_AssocoatedTerminals")}
                                            renderer={handleTerminalColumn}
                                        >
                                        </DataTable.Column>
                                        <DataTable.Column
                                            initialWidth="39%"
                                            className="compColHeight"
                                            key="ProcessName"
                                            field="ProcessName"
                                            header={t("Communication_ProcessName")}
                                            editFieldType="text"
                                        ></DataTable.Column>
                                        <DataTable.Column
                                            initialWidth="10%"
                                            className="compColHeight"
                                            header={t("Communication_ProcessStatus")}
                                            renderer={handleTerminalProcessEnable}
                                        ></DataTable.Column>
                                        <DataTable.Column
                                            initialWidth="8%"
                                            className="compColHeight"
                                            header={t("Communication_RunningStatus")}
                                            renderer={handleTerminalProcessStatus}
                                        ></DataTable.Column>

                                    </DataTable>
                                </div>

                            </AccordionContent>
                        </Accordion>
                    ) : (
                        <Accordion>
                            <Accordion.Content
                                className="attributeAccordian"
                                title={t("CommStatus_Title")}>
                                <div className="row">
                                    <div className="col-12 detailsTable">
                                        <DataTable
                                            data={deviceCommunicationStatusData}
                                            search={true}
                                            searchPlaceholder={t("LoadingDetailsView_SearchGrid")}
                                        >
                                            <DataTable.Column
                                                initialWidth="10%"
                                                className="compColHeight"
                                                key="LocationCode"
                                                field="LocationCode"
                                                header={t("Communication_Area")}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                initialWidth="10%"
                                                className="compColHeight disabledColumn"
                                                key="DeviceCode"
                                                field="DeviceCode"
                                                header={t("Communication_Device")}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                initialWidth="8%"
                                                className="compColHeight disabledColumn"
                                                key="PointName"
                                                field="PointName"
                                                header={t("Communication_Active")}
                                                renderer={handleCommunicationActive}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                initialWidth="7%"
                                                className="compColHeight disabledColumn"
                                                key="CommStatus"
                                                field="CommStatus"
                                                header={t("Communication_Status")}
                                                renderer={handleCommunicationStatus}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                initialWidth="39%"
                                                className="compColHeight"
                                                key="ExeName"
                                                field="ExeName"
                                                header={t("Communication_ProcessName")}
                                                editFieldType="text"
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                initialWidth="8%"
                                                className="compColHeight"
                                                key="ExeStatus"
                                                field="ExeStatus"
                                                header={t("Communication_ProcessStatus")}
                                                renderer={handleProcessStatus}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                initialWidth="8%"
                                                className="compColHeight"
                                                key="RunningStatus"
                                                field="RunningStatus"
                                                header={t("Communication_RunningStatus")}
                                                renderer={handleRunningStatus}
                                            ></DataTable.Column>
                                            <DataTable.Column
                                                initialWidth="10%"
                                                className="compColHeight"
                                                header={t("Communication_CheckNow")}
                                                renderer={handleCheckNow}
                                            ></DataTable.Column>
                                            {Array.isArray(deviceCommunicationStatusData) &&
                                                deviceCommunicationStatusData.length > pageSize ? (
                                                <DataTable.Pagination />) : ("")}
                                        </DataTable>
                                    </div>
                                </div>

                            </Accordion.Content>
                        </Accordion>
                    )
                }

                <br></br>
                <Accordion>
                    <Accordion.Content
                        className="attributeAccordian"
                        title={isEnterpriseNode ? t("ServicesInfo_EnterprisePageTitle") : t("ServicesInfo_lblPageTitle")}>
                        <div className="row">
                            <div className="col-6 detailsTable">
                                {
                                    (Array.isArray(serverStatus)) ?
                                        serverStatus.map((serverData, index) =>
                                            <DataTable
                                                data={[serverData]}
                                                showHeader={index === 0 ? true : false}
                                            >
                                                <DataTable.Column
                                                    initialWidth="30%"
                                                    className="compColHeight"
                                                    header={t("ServiceInfo_ServerName")}
                                                    renderer={handleServerNameColumn}>
                                                </DataTable.Column>

                                                <DataTable.Column
                                                    initialWidth="30%"
                                                    className="compColHeight serverStatus"
                                                    header={t("ServiceInfo_ServiceName")}
                                                    renderer={handleServiceColumn}>
                                                </DataTable.Column>
                                                <DataTable.Column
                                                    initialWidth="12%"
                                                    className="compColHeight serverStatus"
                                                    header={t("ServiceInfo_ServiceStatus")}
                                                    renderer={handleRunningStatusColumn}>
                                                </DataTable.Column>

                                            </DataTable>
                                        ) : null
                                }
                            </div>
                            <div className="col-6 detailsTable">
                                <DataTable data={serverStorageStatus} showHeader={true}>
                                    <DataTable.Column
                                        initialWidth="40%"
                                        header={t("ServiceInfo_ServerName")}
                                        renderer={(cellData) => cellData.rowData.ServerName}>
                                    </DataTable.Column>
                                    <DataTable.Column header={"Details"}
                                        renderer={handleDBDiskRender}>
                                    </DataTable.Column>

                                </DataTable>
                            </div>
                        </div>
                    </Accordion.Content>
                </Accordion>

                <br></br>
                {(isDCHEnable) ? (
                    <Accordion>
                        <Accordion.Content
                            className="attributeAccordian"
                            title={t("DCHSystemStatus")}>
                            <div className="row">
                                <div className="col-8 detailsTable">
                                    <DataTable
                                        data={externalSystemStatusData}>
                                        <DataTable.Column
                                            initialWidth="30%"
                                            className="compColHeight"
                                            key="SystemType"
                                            field="SystemType"
                                            header={t("ShareholderDetails_ExternalSystem")}
                                            editFieldType="text">
                                        </DataTable.Column>
                                        <DataTable.Column
                                            initialWidth="10%"
                                            className="compColHeight"
                                            header={t("Communication_RunningStatus")}
                                            renderer={handleExternalSystemStatus}>
                                        </DataTable.Column>
                                    </DataTable>
                                </div>
                            </div>

                        </Accordion.Content>
                    </Accordion>

                ) : ("")
                }
                {(isArchiveEnable) ? (
                    <div>
                        <div className="row compartmentRow">
                            <div className="col col-md-8 col-lg-9 col col-xl-9">
                                <h4>{t("VWSySArchiveSystemHeader")}</h4>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <InputLabel
                                fluid
                                label={t("vwSysLastArchivedTime") + " : " + lastArchivedTime}
                            />
                        </div>
                    </div>
                ) : ("")
                }
                {(isTWICEnable) ? (
                    <div>
                        <div className="row compartmentRow">
                            <div className="col col-md-8 col-lg-9 col col-xl-9">
                                <h4>{t("VWSySTWICStatusHeader")}</h4>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4">
                            <InputLabel
                                fluid
                                label={t("TWICLastDownloadedTime") + " : " + twicRuntimeValue}
                            />
                        </div>
                    </div>
                ) : ("")
                }
            </div>
        </div>
    )

}