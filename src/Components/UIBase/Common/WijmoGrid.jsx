import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as wjCore from "@grapecity/wijmo";
import * as wjGrid from "@grapecity/wijmo.grid";
import {
  FlexGrid,
  FlexGridColumn,
  FlexGridCellTemplate,
} from "@grapecity/wijmo.react.grid";
import { FlexGridFilter } from "@grapecity/wijmo.react.grid.filter";
import { Operator } from "@grapecity/wijmo.grid.filter";
import { FlexGridSearch } from "@grapecity/wijmo.react.grid.search";
import { CollectionView } from "@grapecity/wijmo";
import { CollectionViewNavigator, ListBox } from "@grapecity/wijmo.react.input";
import { Selector } from "@grapecity/wijmo.grid.selector";
import { HeadersVisibility } from "@grapecity/wijmo.grid";
import { showPopup, hidePopup, PopupPosition } from "@grapecity/wijmo";
import * as wjcGridXlsx from "@grapecity/wijmo.grid.xlsx";
import "@grapecity/wijmo.styles/wijmo.css";
import { GroupPanel } from "@grapecity/wijmo.react.grid.grouppanel";
import { Button, Card, Popup } from "@scuf/common";
import { TranslationConsumer, useTranslation } from "@scuf/localization";
import { Icon } from "@scuf/common";
import ErrorBoundary from "../../ErrorBoundary";
import * as loadash from "lodash";
import "@grapecity/wijmo.touch";

const WijmoGrid = (props) => {
  const [flex, setFlex] = useState(null);
  const [translator] = useTranslation();
  const _getData = (pageLength) => {
    return new CollectionView(props.sourceData, {
      pageSize: pageLength,
    });
  };

  const [data, setData] = useState(_getData(props.rowsPerPage));
  const theGrid = React.createRef();
  const theSearch = React.createRef();
  const gridFilter = React.createRef();
  const pagingComponent = React.createRef();
  const colPicker = React.useRef();

  // to keep track of selected rows
  const selectedRows = React.useRef(props.selectionRequired ? [] : null);

  // to initialize grid checkbox selection
  let selector = null;

  //Initialize grid
  const gridInitialized = (grid) => {
    try {
      // localize grid filter
      customizeFilterConditions();

      if (props.onRowClick) {
        // add row click event handler
        grid.addEventListener(grid.hostElement, "click", (e) => {
          let ht = grid.hitTest(e);
          // condition to check if cell is not a grouped cell and a data cell
          if (
            ht.target.closest(".wj-cell") &&
            ![...ht.target.closest(".wj-cell").classList].includes(
              "wj-group"
            ) &&
            ht.cellType === wjGrid.CellType.Cell
          ) {
            // fetch row data
            const rowData = grid.rows[ht.row].dataItem;
            props.onRowClick(rowData);
          }
        });
      }

      grid.selectionMode = wjCore.asEnum("None", wjGrid.SelectionMode);
      grid.select(-1, -1);

      setFlex(grid);
      if (props.selectionRequired) {
        // enable checkbox selection
        selector = new Selector(grid, {
          itemChecked: (s, e) => {
            // if only single checkbox selection is required
            if (props.singleSelection) {
              grid.rows
                .filter((row) => {
                  return (
                    row.isSelected &&
                    selectedRows.current.filter((item) =>
                      loadash.isEqual(item, row.dataItem)
                    ).length === 1
                  );
                })
                .forEach((row) => {
                  row.isSelected = false;
                });
            }

            // pass row data as parameter to checkbox selection handler
            props.onSelectionHandle(
              grid.rows
                .filter((r) => r.isSelected)
                .map((selectedRow) => selectedRow.dataItem)
            );
          },
          // if only single checkbox selection is required
          showCheckAll: !props.singleSelection,
        });

        let theGrid = selector.column.grid;
        selector.column = theGrid.rowHeaders.columns[0];
        theGrid.headersVisibility = HeadersVisibility.All;
        theGrid.selectionMode = wjCore.asEnum("None", wjGrid.SelectionMode);
      }
    } catch (error) {
      console.log("Error in gridInitialized: " + error);
    }
  };

  //Update grid when data changes
  useEffect(() => {
    try {
      if (theGrid != null) {
        //Connect search to the grid
        let grid = theGrid.current.control;
        let search = theSearch.current.control;
        search.grid = grid;
      }

      setData(_getData(props.rowsPerPage));
    } catch (error) {
      console.log("Error in grid update:", error);
    }
  }, [props.sourceData]);

  // Pre-select grid rows based on selectedItems props
  useEffect(() => {
    try {
      if (flex && props.selectionRequired) {
        // clear the selectedRows array
        selectedRows.current.length = 0;
        // add selectedItems array items to selectedRows
        selectedRows.current.push(...props.selectedItems);

        flex.rows.forEach((row) => {
          if (
            props.selectedItems.filter((item) =>
              loadash.isEqual(item, row.dataItem)
            ).length === 1
          ) {
            // checks the row checkbox
            row.isSelected = true;
          } else {
            // unchecks the row checkbox
            row.isSelected = false;
          }
        });

        flex.refresh();
      }
    } catch (error) {
      console.log("Error in pre-selecting rows:", error);
    }
  }, [props.selectedItems]);

  //Load the state of grid
  useEffect(() => {
    try {
      if (
        localStorage.getItem(props.parentComponent + "GridState") &&
        localStorage.getItem(props.parentComponent + "GridState") !== "null" &&
        flex
      ) {
        // restore grid settings
        let gridState = JSON.parse(
          localStorage.getItem(props.parentComponent + "GridState")
        );
        let newFlex = flex;

        // restore column picker settings
        newFlex.columns.forEach((col) => {
          let matchedCol = gridState.columns.filter(
            (colSetting) => colSetting.binding === col.binding
          );
          col.visible =
            matchedCol.length > 0 ? matchedCol[0].visible : col.visible;
        });

        // restore filter settings
        gridFilter.current.control.filterDefinition =
          gridState.filterDefinition;

        // restore sort settings
        newFlex.collectionView.deferUpdate(() => {
          newFlex.collectionView.sortDescriptions.clear();
          for (let i = 0; i < gridState.sortDescriptions.length; i++) {
            let sortDesc = gridState.sortDescriptions[i];
            newFlex.collectionView.sortDescriptions.push(
              new wjCore.SortDescription(sortDesc.property, sortDesc.ascending)
            );
          }
        });

        // restore grouping settings
        for (let i = 0; i < gridState.groupDescriptions.length; i++) {
          newFlex.collectionView.groupDescriptions.push(
            new wjCore.PropertyGroupDescription(gridState.groupDescriptions[i])
          );
          newFlex.columns.filter(
            (col) => col.binding === gridState.groupDescriptions[i]
          )[0].visible = false;
        }

        if (
          sessionStorage.getItem(props.parentComponent + "GridState") &&
          sessionStorage.getItem(props.parentComponent + "GridState") !== "null"
        ) {
          let gridSessionState = JSON.parse(
            sessionStorage.getItem(props.parentComponent + "GridState")
          );
          // restore paging settings
          newFlex.collectionView.moveToPage(
            newFlex.collectionView.pageCount - 1 >= gridSessionState.pageIndex
              ? gridSessionState.pageIndex
              : newFlex.collectionView.pageCount - 1
          );

          // restore search settings
          if (theSearch) {
            theSearch.current.control.text = gridSessionState.searchText;
          }
        }

        setFlex(newFlex);
        flex.refresh();
      }
    } catch (error) {
      console.log("Error in restoring local storage settings: ", error);
    }
  }, [data]);

  // Set Column Picker Properties
  useEffect(() => {
    try {
      if (flex && colPicker.current && props.columnPickerRequired) {
        colPicker.current.itemsSource = flex.columns;
        colPicker.current.checkedMemberPath = "visible";
        colPicker.current.displayMemberPath = "header";
        colPicker.current.lostFocus.addHandler(() => {
          hidePopup(colPicker.current.hostElement);
        });
      }
    } catch (error) {
      console.log("Error in initializing column picker properties:", error);
    }
  }, [colPicker.current]);

  useEffect(() => {
    // remove column picker pop-up on component unmount
    return () => {
      if (props.columnPickerRequired && colPicker.current) {
        hidePopup(colPicker.current.hostElement);
      }
    };
  }, []);

  // export grid data to excel
  const exportExcel = () => {
    try {
      let gridFlex = flex;
      //to download all rows from all pages
      gridFlex.itemsSource.pageSize = props.sourceData.length;
      setFlex(gridFlex);
      wjcGridXlsx.FlexGridXlsxConverter.saveAsync(
        flex,
        {
          includeColumnHeaders: true,
          includeCellStyles: false,
          formatItem: null,
        },
        props.exportFileName
      );

      //to restore paging
      gridFlex.itemsSource.pageSize = props.rowsPerPage;
      setFlex(gridFlex);
    } catch (error) {
      console.log("Error in export grid to excel:", error);
    }
  };

  const terminalPopOver = (terminalCodes) => {
    if (terminalCodes.split(",").length > props.terminalsToShow) {
      return (
        <Popup
          className="popup-theme-wrap"
          on="hover"
          element={terminalCodes.split(",").length}
        >
          <Card>
            <Card.Content>{terminalCodes}</Card.Content>
          </Card>
        </Popup>
      );
    } else {
      return terminalCodes;
    }
  };

  const displayValues = (value, columnDetail) => {
    if (columnDetail !== undefined && columnDetail !== null) {
      if (typeof value === "boolean" || columnDetail.Name === "Active") {
        if (value) return <Icon name="check" size="small" color="green" />;
        else return <Icon name="close" size="small" color="red" />;
      } else if (value === "" || value === null || value === undefined) {
        return value;
      } else if (
        (columnDetail.Name === "TerminalCodes" ||
          columnDetail.PopOver === "1") &&
        value !== null
      ) {
        return terminalPopOver(value);
      }
      // var columnType = columnDetails.find(function (detail) {
      //   if (detail.Name === field) {
      //     return detail;
      //   }
      // });
      else if (
        columnDetail.DataType !== undefined &&
        columnDetail.DataType === "DateTime"
      ) {
        return (
          new Date(value).toLocaleDateString() +
          " " +
          new Date(value).toLocaleTimeString()
        );
      } else if (
        columnDetail.DataType !== undefined &&
        columnDetail.DataType === "Date"
      ) {
        return new Date(value).toLocaleDateString();
      } else if (
        columnDetail.DataType !== undefined &&
        columnDetail.DataType === "Time"
      ) {
        return new Date(value).toLocaleTimeString();
      }
    }

    return value;
  };

  //Initialize Column Picker
  const initializedPicker = (picker) => {
    if (props.columnPickerRequired) {
      colPicker.current = picker;
    }
  };

  // Column Picker Handler
  const colPickerClickHandler = (event) => {
    try {
      let host = colPicker.current.hostElement;
      if (!host.offsetHeight) {
        showPopup(host, event.target, PopupPosition.Below, true, false);
        colPicker.current.focus();
      } else {
        hidePopup(host, true, true);
        flex.focus();
      }

      colPicker.current.focus();
      event.preventDefault();
    } catch (error) {
      console.log("Error in Column Picker click event:", error);
    }
  };

  const saveGridState = () => {
    try {
      if (flex && gridFilter.current) {
        // grid column, filter, sort and grouping settings
        let gridState = {
          columns: flex.columns.map((col) => {
            return {
              binding: col.binding,
              visible: col.visible,
            };
          }),
          filterDefinition: gridFilter.current.control.filterDefinition,
          sortDescriptions: flex.collectionView.sortDescriptions.map(
            (sortDesc) => {
              return {
                property: sortDesc.property,
                ascending: sortDesc.ascending,
              };
            }
          ),
          groupDescriptions: flex.collectionView.groupDescriptions.map(
            (group) => {
              if (group.propertyName) {
                return group.propertyName;
              }

              return null;
            }
          ),
        };

        // add class to grouped checkbox div element
        if (
          flex.collectionView.groupDescriptions &&
          flex.collectionView.groupDescriptions.length > 0
        ) {
          let groupedCheckboxes = [
            ...document.getElementsByClassName("wj-column-selector-group"),
          ];
          groupedCheckboxes.forEach((chkbx) => {
            chkbx.parentNode.parentNode.classList.add("wj-grouped-checkbox");
          });
        }

        // grid paging and search settings
        let sessionState = {
          pageIndex: flex.collectionView.pageIndex,
          searchText: theSearch.current.control.text,
        };

        localStorage.setItem(
          props.parentComponent + "GridState",
          JSON.stringify(gridState)
        );
        sessionStorage.setItem(
          props.parentComponent + "GridState",
          JSON.stringify(sessionState)
        );
      }
    } catch (error) {
      console.log("Error in saving grid state");
    }
  };

  // customize grid filter text and dropdowns
  const customizeFilterConditions = () => {
    // localize the FlexGrid filter
    let filter = wjCore.culture.FlexGridFilter,
      operator = Operator;
    wjCore.culture.FlexGridFilter.header = translator("WijmoGridFilterHeader");
    wjCore.culture.FlexGridFilter.ascending =
      "\u2191 " + translator("WijmoGridFilterAscending");
    wjCore.culture.FlexGridFilter.descending =
      "\u2193 " + translator("WijmoGridFilterDescending");
    wjCore.culture.FlexGridFilter.apply = translator("RoleAdminEdit_Apply");
    wjCore.culture.FlexGridFilter.clear = translator("OrderCreate_btnClear");
    wjCore.culture.FlexGridFilter.conditions = translator(
      "WijmoGridFilterCondition"
    );
    wjCore.culture.FlexGridFilter.values = translator("WijmoGridFilterValue");
    wjCore.culture.FlexGridFilter.search = translator(
      "LoadingDetailsView_SearchGrid"
    );
    wjCore.culture.FlexGridFilter.selectAll = translator(
      "WijmoGridFilterSelectAll"
    );
    wjCore.culture.FlexGridFilter.and = translator("WijmoGridFilterAnd");
    wjCore.culture.FlexGridFilter.or = translator("WijmoGridFilterOr");
    wjCore.culture.FlexGridFilter.cancel = translator("AccessCardInfo_Cancel");
    // wjCore.culture.FlexGridFilter.null = 'test';
    // wjCore.culture.FlexGridFilter.ariaLabels.and = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.asc = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.dialog = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.dsc = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.edit = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.op1 = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.op2 = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.or = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.search = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.val1 = '';
    // wjCore.culture.FlexGridFilter.ariaLabels.val2 = '';

    // localize FlexGrid filter operators
    filter.stringOperators = [
      { name: translator("WijmoGridFilterUnset"), op: null },
      { name: translator("WijmoGridFilterEqual"), op: operator.EQ },
      { name: translator("WijmoGridFilterNotEqual"), op: operator.NE },
      { name: translator("WijmoGridFilterBeginsWith"), op: operator.BW },
      { name: translator("WijmoGridFilterEndsWith"), op: operator.EW },
      { name: translator("WijmoGridFilterContains"), op: operator.CT },
      { name: translator("WijmoGridFilterDoesNotContain"), op: operator.NC },
    ];
    filter.numberOperators = [
      { name: translator("WijmoGridFilterUnset"), op: null },
      { name: translator("WijmoGridFilterEqual"), op: operator.EQ },
      { name: translator("WijmoGridFilterNotEqual"), op: operator.NE },
      { name: translator("WijmoGridFilterGreaterThan"), op: operator.GT },
      { name: translator("WijmoGridFilterLessThan"), op: operator.LT },
      {
        name: translator("WijmoGridFilterGreaterThanOrEqual"),
        op: operator.GE,
      },
      { name: translator("WijmoGridFilterLessThanOrEqual"), op: operator.LE },
    ];
    filter.dateOperators = [
      { name: translator("WijmoGridFilterUnset"), op: null },
      { name: translator("WijmoGridFilterEqual"), op: operator.EQ },
      { name: translator("WijmoGridFilterDateEarlierThan"), op: operator.LT },
      { name: translator("WijmoGridFilterDateLaterThan"), op: operator.GT },
    ];
    filter.booleanOperators = [
      { name: translator("WijmoGridFilterUnset"), op: null },
      { name: translator("WijmoGridFilterEqual"), op: operator.EQ },
      { name: translator("WijmoGridFilterNotEqual"), op: operator.NE },
    ];
  };

  // set column width based on screen size
  const getWidth = (columnDetails) => {
    try {
      const screenWidth = window.screen.width;
      if (screenWidth < 1024) {
        if (columnDetails.WidthPx && columnDetails.WidthPx !== "")
          return parseInt(columnDetails.WidthPx);
      }
    } catch (error) {
      console.log("Error in width:", error);
    }

    return columnDetails.WidthPercentage.includes("*")
      ? columnDetails.WidthPercentage
      : parseInt(columnDetails.WidthPercentage);
  };

  return (
    <div className="pl-1">
      <ErrorBoundary>
        <TranslationConsumer>
          {(t) => (
            <React.Fragment>
              <div className="row pl-0">
                <div className="col-10 col-sm-12 col-md-5 col-lg-6">
                  <FlexGridSearch
                    class="ui single-input"
                    ref={theSearch}
                    placeholder={t("LoadingDetailsView_SearchGrid")}
                  />
                </div>
                <div className="col-10 col-sm-12 col-md-7 col-lg-6">
                  <div style={{ float: "right" }}>
                    {props.columnPickerRequired ? (
                      <Button
                        id="colPicker"
                        actionType="button"
                        type="primary"
                        onClick={(event) => colPickerClickHandler(event)}
                      >
                        <div style={{ display: "inline-block" }}>
                          {t("WijmoGridColumnPicker")}
                        </div>
                        <div style={{ display: "inline-block" }}>
                          <Icon
                            name="caret-down"
                            className="btnIcon"
                            size="small"
                          />
                        </div>
                      </Button>
                    ) : null}
                    {props.exportRequired ? (
                      <Button
                        actionType="button"
                        type="primary"
                        className="mt-3 mt-md-0"
                        onClick={exportExcel}
                      >
                        <div style={{ display: "inline-block" }}>
                          {t("WijmoGridExport")}
                        </div>
                        <div
                          style={{
                            display: "inline-block",
                            marginLeft: "0.2rem",
                          }}
                        >
                          <span
                            className="icon-Xls"
                            style={{
                              fontSize: "17px",
                              position: "absolute",
                              top: "3px",
                            }}
                          ></span>
                        </div>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="tableScroll">
                {props.columnGroupingRequired ? (
                  <GroupPanel
                    className="group-panel"
                    grid={flex}
                    placeholder={t("WijmoGridGroupPanelPlaceholder")}
                  />
                ) : null}
                <ErrorBoundary>
                  <FlexGrid
                    ref={theGrid}
                    autoGenerateColumns={false}
                    alternatingRowStep={0}
                    autoRowHeights={true}
                    headersVisibility="Column"
                    itemsSource={data}
                    selectionMode={wjCore.asEnum("None", wjGrid.SelectionMode)}
                    initialized={gridInitialized}
                    virtualizationThreshold={[0, 10000]}
                    onUpdatedView={saveGridState}
                  >
                    <FlexGridFilter ref={gridFilter} />
                    {props.columns.map((column) => {
                      return (
                        <FlexGridColumn
                          header={t(column.Name)}
                          key={column.Name}
                          binding={column.Name}
                          width={getWidth(column)}
                          minWidth={100}
                          isReadOnly={true}
                          wordWrap={true}
                          align="left"
                        >
                          <FlexGridCellTemplate
                            cellType="Cell"
                            template={(context) => {
                              return (
                                <span
                                  style={
                                    props.conditionalRowStyleCheck == null ||
                                    !props.conditionalRowStyleCheck(
                                      context.item
                                    )
                                      ? null
                                      : { ...props.conditionalRowStyles }
                                  }
                                >
                                  {displayValues(
                                    context.item[column.Name],
                                    column
                                  )}
                                </span>
                              );
                            }}
                          />
                        </FlexGridColumn>
                      );
                    })}
                  </FlexGrid>
                </ErrorBoundary>
                {props.columnPickerRequired ? (
                  <div className="column-picker-div">
                    <ListBox
                      className="column-picker"
                      initialized={(picker) => initializedPicker(picker)}
                    />
                  </div>
                ) : null}
              </div>
              <div className="row">
                <CollectionViewNavigator
                  ref={pagingComponent}
                  className="ml-auto mr-auto mt-3"
                  headerFormat={t("WijmoGridPagingTemplate")}
                  byPage={true}
                  cv={data}
                />
              </div>
            </React.Fragment>
          )}
        </TranslationConsumer>
      </ErrorBoundary>
    </div>
  );
};

WijmoGrid.propTypes = {
  sourceData: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  exportRequired: PropTypes.bool.isRequired,
  exportFileName: PropTypes.string,
  selectionRequired: PropTypes.bool,
  columnPickerRequired: PropTypes.bool,
  columnGroupingRequired: PropTypes.bool,
  conditionalRowStyleCheck: PropTypes.func,
  conditionalRowStyles: PropTypes.object,
  rowsPerPage: PropTypes.number,
  onSelectionHandle: PropTypes.func,
  parentComponent: PropTypes.string.isRequired,
  onRowClick: PropTypes.func,
  terminalsToShow: PropTypes.number,
  singleSelection: PropTypes.bool,
  selectedItems: PropTypes.array,
};

WijmoGrid.defaultProps = {
  sourceData: [],
  columns: [],
  exportRequired: true,
  exportFileName: "Grid.xlsx",
  selectionRequired: false,
  columnPickerRequired: false,
  columnGroupingRequired: false,
  rowsPerPage: 10,
  terminalsToShow: 2,
  singleSelection: false,
  selectedItems: [],
};

export default WijmoGrid;
