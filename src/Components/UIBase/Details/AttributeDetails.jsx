import React from "react";
import { Checkbox } from "@scuf/common";
import { Input, DatePicker } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import * as Constants from "../../../JS/Constants";
import { getCurrentDateFormat } from "../../../JS/functionalUtilities";

export function AttributeDetails({
    selectedAttributeList,
    handleCellDataEdit,
    attributeValidationErrors,
}) {
    const handleAttributeDateValue = (attribute) => {
        if (attribute.DefaultValue === '0000-00-00') {
            convertAttributeDatetoString(attribute,new Date());
            return new Date();
        } else {
            var chars = attribute.DefaultValue.split('-');
            return new Date(chars[0],chars[1]-1,chars[2]);
        }
    } 
    const convertAttributeDatetoString = (attribute, value) => {
        var Dateval = new Date(value);
        value = Dateval.getFullYear() + "-" + ("0" + (Dateval.getMonth() + 1)).slice(-2) + "-" + ("0" + Dateval.getDate()).slice(-2);
        handleCellDataEdit(attribute,value);
    }
    return (
        <TranslationConsumer>
            {(t) => (
                <div className="row" >
                    <div className="col-md-12 attributeDetails-wrap">
                        <div className="row">
                            {
                                selectedAttributeList.map((attribute) =>
                                    attribute.DataType.toLowerCase() === Constants.DataType.STRING.toLowerCase() && attribute.IsVisible === true ?
                                        <div className="col-12 col-md-6 col-lg-4" >
                                            <Input
                                                fluid
                                                label={t(attribute.DisplayName)}
                                                value={attribute.DefaultValue === null ? "" : attribute.DefaultValue}
                                                indicator={attribute.IsMandatory === true ? "required" : null}
                                                disabled={attribute.IsReadonly === true ? true : false}
                                                onChange={(value) => handleCellDataEdit(attribute, value)}
                                                error={t(attributeValidationErrors[attribute.Code])}
                                                reserveSpace={false}
                                            />
                                        </div> : (attribute.DataType.toLowerCase() === Constants.DataType.INT.toLowerCase() || attribute.DataType.toLowerCase() === Constants.DataType.LONG.toLowerCase()) && attribute.IsVisible === true  ?
                                            <div className="col-12 col-md-6 col-lg-4" >
                                                <Input
                                                    fluid
                                                    label={t(attribute.DisplayName)}
                                                    value={attribute.DefaultValue === null ? "" : attribute.DefaultValue}

                                                    indicator={attribute.IsMandatory === true ? "required" : null}
                                                    disabled={attribute.IsReadonly === true ? true : false}
                                                    onChange={(value) => handleCellDataEdit(attribute, value)}
                                                    error={t(attributeValidationErrors[attribute.Code])}
                                                    reserveSpace={false}
                                                />
                                            </div>

                                            : (attribute.DataType.toLowerCase() === Constants.DataType.FLOAT.toLowerCase() || attribute.DataType.toLowerCase() === Constants.DataType.DOUBLE.toLowerCase()) && attribute.IsVisible === true ?
                                                <div className="col-12 col-md-6 col-lg-4" >
                                                    <Input
                                                        fluid
                                                        label={t(attribute.DisplayName)}
                                                        value={
                                                            //parseFloat
                                                            (attribute.DefaultValue === null || attribute.DefaultValue === "") ? "" : (attribute.DefaultValue).toLocaleString()
                                                        }
                                                        indicator={attribute.IsMandatory === true ? "required" : null}
                                                        disabled={attribute.IsReadonly === true ? true : false}
                                                        onChange={(value) => handleCellDataEdit(attribute, value)}
                                                        error={t(attributeValidationErrors[attribute.Code])}
                                                        reserveSpace={false}
                                                    />
                                                </div> :
                                                attribute.DataType.toLowerCase() === Constants.DataType.BOOL.toLowerCase() && attribute.IsVisible === true ?
                                                    <div className="col-12 col-md-6 col-lg-4">
                                                        <Checkbox className="deviceCheckBox customDeviceCheckBox"
                                                            label={t(attribute.DisplayName)}
                                                            checked={attribute.DefaultValue === null ? "" : attribute.DefaultValue.toString().toLowerCase() === "true" ? true : false}
                                                            disabled={attribute.IsReadonly === true ? true : false}
                                                            onChange={(value) => handleCellDataEdit(attribute, value)}
                                                        >
                                                        </Checkbox>
                                                    </div>
                                                    : attribute.DataType.toLowerCase() === Constants.DataType.DATETIME.toLowerCase() && attribute.IsVisible === true ?
                                                   
                                                        <div className="col-12 col-md-6 col-lg-4" >
                                                            <DatePicker
                                                                fluid
                                                                value={(attribute.DefaultValue === null || attribute.DefaultValue === "") ? ""
                                                                    : handleAttributeDateValue(attribute)
                                                                }
                                                                label={t(attribute.DisplayName)}
                                                                displayFormat={getCurrentDateFormat()}
                                                                showYearSelector="true"
                                                                indicator={attribute.IsMandatory === true ? "required" : null}
                                                                disabled={attribute.IsReadonly === true ? true : false}
                                                                onChange={(value) => 
                                                                    convertAttributeDatetoString(attribute, value)
                                                                }
                                                                onTextChange={(value) => {
                                                                    convertAttributeDatetoString(attribute, value)
                                                                }}
                                                                error={t(attributeValidationErrors[attribute.Code])}
                                                                reserveSpace={false}
                                                            />
                                                        </div> : null
                                )
                            }
                        </div>
                    </div>
                </div>
            )}
        </TranslationConsumer>
    );
}
