import { Checkbox, Input, Select, Tooltip } from '@scuf/common';
import { TranslationConsumer } from '@scuf/localization';
import React from 'react';
import PropTypes from "prop-types";
import ErrorBoundary from '../../ErrorBoundary';

const ProductForecastConfigurationDetail = (props) => {

    const renderControl = (translator, controlInfo) => {
        // display textbox control
        if (controlInfo.DataType === "string" ||
            controlInfo.DataType === "int" ||
            controlInfo.DataType === "decimal") {
            return <Tooltip
                element={<Input
                    fluid
                    indicator="required"
                    disabled={false}
                    label={translator(controlInfo.Name + "_label")}
                    onChange={(data) => props.onChange(controlInfo.Name, data)}
                    reserveSpace={false}
                    error={translator(props.validationErrors[controlInfo.Name])}
                    value={controlInfo.Value}
                />
                }
                hoverable={true}
                event="hover"
                content={translator(controlInfo.Name + "_tooltip")}
            />
        }
        // display dropdwon control with select-all checkbox
        else if (controlInfo.DataType === "multiselect") {
            let options = getDropdownOptionsForSelect(controlInfo);

            let selectedOptions = Array.isArray(controlInfo.Value) ? controlInfo.Value : (
                controlInfo.Value === "" ? [] : controlInfo.Value.split(",")
            );

            return (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ width: "80%" }}>
                        <Tooltip
                            element={
                                <Select
                                    fluid
                                    indicator="required"
                                    multiple={true}
                                    options={options}
                                    disabled={false}
                                    placeholder={translator("Select")}
                                    label={translator(controlInfo.Name + "_label")}
                                    onChange={(value) => props.onChange(controlInfo.Name, value.join())}
                                    reserveSpace={false}
                                    error={translator(props.validationErrors[controlInfo.Name])}
                                    search={false}
                                    value={selectedOptions}
                                />
                            }
                            content={translator(controlInfo.Name + "_tooltip")}
                            hoverable={true}
                            event="hover"
                        />
                    </div>
                    <div className='ddlSelectAll'>
                        <Tooltip
                            element={
                                <Checkbox
                                    label={translator("Common_All")}
                                    checked={
                                        selectedOptions.length === options.length
                                    }
                                    onChange={(checked) => props.onCheckAllChange(checked, controlInfo.Name)}
                                ></Checkbox>
                            }
                            content={translator(controlInfo.Name + "_checkAll_tooltip")}
                            event="hover"
                            hoverable={true}
                        />
                    </div>
                </div>
            )
        }
        // display dropdown for single selection dropdown
        else if (controlInfo.DataType === "select") {
            let options = getDropdownOptionsForSelect(controlInfo);

            return (
                <Tooltip
                    element={
                        <Select
                            fluid
                            indicator='required'
                            multiple={false}
                            disabled={false}
                            options={options}
                            placeholder={translator("Select")}
                            label={translator(controlInfo.Name + "_label")}
                            onChange={(value) => props.onChange(controlInfo.Name, value)}
                            reserveSpace={false}
                            error={translator(props.validationErrors[controlInfo.Name])}
                            search={false}
                            value={controlInfo.Value === "" ? null : controlInfo.Value}
                        />
                    }
                    hoverable={true}
                    event="hover"
                    content={translator(controlInfo.Name + "_tooltip")}
                />
            )
        }
    }

    // populate parameters in an array object for dropdowns
    const getDropdownOptionsForSelect = (item) => {
        let options = [];

        if (Object.keys(props.controlParameters).includes(item.Name) &&
            Array.isArray(props.controlParameters[item.Name])) {
            props.controlParameters[item.Name].forEach(elem => {
                options.push({
                    text: elem,
                    value: elem
                });
            });
        }

        return options;
    }

    return (
        <ErrorBoundary>
            <div className='detailsContainer'>
                <TranslationConsumer>
                    {
                        (t) => (
                            <div className='row mt-3'>
                                {
                                    props.modProductForecastConfiguration.ProductForecastParams.map(param => {
                                        return (
                                            <div className='col-12 col-md-6 col-lg-4'>
                                                {renderControl(t, param)}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        )
                    }
                </TranslationConsumer>
            </div>
        </ErrorBoundary>
    );
}

ProductForecastConfigurationDetail.propTypes = {
    modProductForecastConfiguration: PropTypes.object.isRequired,
    controlParameters: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    validationErrors: PropTypes.object.isRequired,
    onCheckAllChange: PropTypes.func
}

export default ProductForecastConfigurationDetail;