import dayjs from "dayjs";

const authType = window["runConfig"].authType;
let isArchive = false;

export function setArchive(value) {
  if (value !== undefined && value !== null)
    isArchive = value;
}
export function validateField(validationDefList, value) {

  //minLength validation

  if (validationDefList.length === 0) {
    return "";
  }
  let minLengthValidator = validationDefList.find(function (def) {
    if (def.minLength !== undefined) {
      return def;
    }
  });

  if (
    minLengthValidator !== undefined &&
    minLengthValidator.minLength > 0 &&
    (value === undefined || value === null || value.toString().trim() === "")
  ) {
    return minLengthValidator.errorCode;
  }

  if (
    (minLengthValidator === undefined || minLengthValidator.minLength === 0) &&
    (value === undefined || value === null || value.toString().trim() === "")
  ) {
    return "";
  }

  let maxLengthValidator = validationDefList.find(function (def) {
    if (def.maxLength !== undefined) {
      return def;
    }
  });

  //maxlength validatior
  if (
    maxLengthValidator !== undefined &&
    value !== undefined &&
    value.length > maxLengthValidator.maxLength
  ) {
    return maxLengthValidator.errorCode;
  }

  let expressionValidator = validationDefList.find(function (def) {
    if (def.expression !== undefined) {
      return def;
    }
  });
  //expression validator
  if (value !== null && value !== undefined) {
    if (
      expressionValidator !== undefined &&
      !value.toString().match(expressionValidator.expression)
    ) {
      return expressionValidator.errorCode;
    }
  }

  let dateValidator = validationDefList.find(function (def) {
    if (def.isDate !== undefined) {
      return def;
    }
  });

  //date validator
  if (dateValidator !== undefined) {
    if (isNaN(Date.parse(value))) {
      return dateValidator.errorCode;
    }

    let pastDateValidator = validationDefList.find(function (def) {
      if (def.denyPastDate !== undefined) {
        return def;
      }
    });
    // console.log("DateValue-1-",new Date(Date.parse(value)).setHours(23,59,59,999));
    // console.log("Current Date-2-",new Date().setHours(23,59,59,999));
    if (
      pastDateValidator !== undefined &&
      new Date(Date.parse(value)).setHours(23, 59, 59, 999) < new Date().setHours(23, 59, 59, 999)
    ) {
      return pastDateValidator.errorCode;
    }

    let futureDateValidator = validationDefList.find(function (def) {
      if (def.denyFutureDate !== undefined) {
        return def;
      }
    });

    if (
      futureDateValidator !== undefined &&
      new Date(Date.parse(value)).setHours(0, 0, 0, 0) > new Date()
    ) {
      return futureDateValidator.errorCode;
    }
  }
  let integerValidator = validationDefList.find(function (def) {
    if (def.isInt !== undefined) {
      return def;
    }
  });

  if (integerValidator !== undefined) {
    let intNumber = ""
    if (value !== undefined && value !== null && value.toString().trim() !== "")
      intNumber = value.toString();
    if (!intNumber.match(new RegExp('^[-+]?[0-9]+$'))) {
      return integerValidator.errorCode;
    }

    if (isNaN(Number(intNumber))) {
      return integerValidator.errorCode;
    } else {
      let minIntValidator = validationDefList.find(function (def) {
        if (def.minIntValue !== undefined) {
          return def;
        }
      });
      if (minIntValidator !== undefined) {
        if (parseInt(intNumber) < minIntValidator.minIntValue) {
          return minIntValidator.errorCode;
        }
      }

      let maxIntValidator = validationDefList.find(function (def) {
        if (def.maxIntValue !== undefined) {
          return def;
        }
      });
      if (maxIntValidator !== undefined) {
        if (parseInt(intNumber) > maxIntValidator.maxIntValue) {
          return maxIntValidator.errorCode;
        }
      }

    }
  }

  let decimalValidator = validationDefList.find(function (def) {
    if (def.isDecimal !== undefined) {
      return def;
    }
  });

  if (decimalValidator !== undefined) {
    let thousandSeparator = (11111).toLocaleString().replace(/1/g, "");
    if (thousandSeparator.length > 1) {
      thousandSeparator = thousandSeparator[0];
    }
    let decimalSeparator = (1.1).toLocaleString().replace(/1/g, "");
    let decimalNumber = "";

    if (value !== undefined && value !== null && value.toString().trim() !== "")
      decimalNumber = value.toString();

    if (thousandSeparator !== "," && decimalSeparator !== ",") {
      if (decimalNumber.match(new RegExp("\\,", "g"))) {
        return decimalValidator.errorCode;
      }
    }
    if (thousandSeparator !== "." && decimalSeparator !== ".") {
      if (decimalNumber.match(new RegExp("\\.", "g"))) {
        return decimalValidator.errorCode;
      }
    }
    //decimalNumber = decimalNumber.replace(new RegExp("\\.", "g"), "");
    if (thousandSeparator.trim() === "")
      decimalNumber = decimalNumber.replace(/\s/g, "");
    else
      decimalNumber = decimalNumber.replace(
        new RegExp("\\" + thousandSeparator, "g"),
        ""
      );

    if (decimalSeparator.trim() === "")
      decimalNumber = decimalNumber.replace(/\s/g, ".");
    else
      decimalNumber = decimalNumber.replace(
        new RegExp("\\" + decimalSeparator, "g"),
        "."
      );

    // let decimalNumber = value
    // .toString()
    // //.replace(new RegExp("\\" + thousandSeparator, "g"), "")
    // //.replace(/\s/g, "")
    // .replace(new RegExp("\\" + decimalSeparator), ".");
    //debugger;
    if (isNaN(Number(decimalNumber))) {
      return decimalValidator.errorCode;
    } else {
      let mindecimalValidator = validationDefList.find(function (def) {
        if (def.minDecimalValue !== undefined) {
          return def;
        }
      });
      if (mindecimalValidator !== undefined) {
        if (parseFloat(decimalNumber) <= mindecimalValidator.minDecimalValue) {
          return mindecimalValidator.errorCode;
        }
      }

      let maxdecimalValidator = validationDefList.find(function (def) {
        if (def.maxDecimalValue !== undefined) {
          return def;
        }
      });

      if (maxdecimalValidator !== undefined) {
        if (parseFloat(decimalNumber) > maxdecimalValidator.maxDecimalValue) {
          return maxdecimalValidator.errorCode;
        }
      }
    }
  }

  return "";
}

export function valiateAttributeField(attributeDetails, value) {
  if (attributeDetails === undefined) {
    return "";
  }

  if (
    attributeDetails.IsMandatory === true &&
    (value === undefined || value === null || value.toString().trim() === "")
  ) {
    return "AttributeInfo_AttributeValueRequired";
  }
  if (attributeDetails.DataType.toLowerCase() === "int" || attributeDetails.DataType.toLowerCase() === "long") {
    let intNumber = ""
    if (value !== undefined && value !== null && value.toString().trim() !== "") {
      intNumber = value.toString();
      if (!intNumber.match(new RegExp('^[-+]?[0-9]+$'))) {
        return "AttributeInfo_AttributeNumberValid";
      }
      if (attributeDetails.MinValue !== "" && attributeDetails.MinValue !== null) {
        if (parseInt(value) < attributeDetails.MinValue) {
          return "AttributeInfo_MinValidation";
        }
      }
      if (attributeDetails.MaxValue !== "" && attributeDetails.MaxValue !== null) {
        if (parseInt(value) > attributeDetails.MaxValue) {
          return "AttributeInfo_MaxValidation";
        }
      }
      if ((attributeDetails.MaxValue === "" || attributeDetails.MaxValue === null) && 10 < value.length) {
        return "Common_MaxLengthExceeded";
      }
    }
  }
  else if (attributeDetails.DataType === "Double" || attributeDetails.DataType === "Float") {
    let decimalNumber = ""
    if (value !== undefined && value !== null && value.toString().trim() !== "") {
      decimalNumber = value.toString();


      let thousandSeparator = (11111).toLocaleString().replace(/1/g, "");
      if (thousandSeparator.length > 1) {
        thousandSeparator = thousandSeparator[0];
      }
      let decimalSeparator = (1.1).toLocaleString().replace(/1/g, "");


      if (thousandSeparator !== "," && decimalSeparator !== ",") {
        if (decimalNumber.match(new RegExp("\\,", "g"))) {
          return "AttributeInfo_AttributeNumberValid";
        }
      }
      if (thousandSeparator !== "." && decimalSeparator !== ".") {
        if (decimalNumber.match(new RegExp("\\.", "g"))) {
          return "AttributeInfo_AttributeNumberValid";
        }
      }

      if (thousandSeparator.trim() === "")
        decimalNumber = decimalNumber.replace(/\s/g, "");
      else
        decimalNumber = decimalNumber.replace(
          new RegExp("\\" + thousandSeparator, "g"),
          ""
        );

      if (decimalSeparator.trim() === "")
        decimalNumber = decimalNumber.replace(/\s/g, ".");
      else
        decimalNumber = decimalNumber.replace(
          new RegExp("\\" + decimalSeparator, "g"),
          "."
        );

      if (isNaN(Number(decimalNumber))) {
        return "AttributeInfo_AttributeNumberValid";
      }
      else {
        if (attributeDetails.MinValue !== "" && attributeDetails.MinValue !== null) {
          if (parseFloat(decimalNumber) < attributeDetails.MinValue) {
            return "AttributeInfo_MinValidation";
          }
        }
        if (attributeDetails.MaxValue !== "" && attributeDetails.MaxValue !== null) {
          if (parseFloat(decimalNumber) > attributeDetails.MaxValue) {
            return "AttributeInfo_MaxValidation";
          }
        }
        if ((attributeDetails.MaxValue === "" || attributeDetails.MaxValue === null) && 10 < decimalNumber.length) {
          return "Common_MaxLengthExceeded";
        }
      }
      // if (!Number.match(new RegExp('^[-+]?[0-9]+([.][0-9]+)?$'))) {
      //   return "AttributeInfo_AttributeNumberValid";
      // }

    }
  }
  else if (attributeDetails.DataType.toLowerCase() === "datetime") {
    if (value !== undefined && value !== null && value.toString().trim() !== "") {
      if (isNaN(Date.parse(value))) {
        return "AttributeInfo_AttributeDateInValid";
      }
      if (attributeDetails.ValidationFormat !== null) {
        if (attributeDetails.ValidationFormat === "GREATERTHANTODAY") {
          if (new Date(Date.parse(value)).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
            return "AttributeInfo_Date_GreaterthanToday";
          }
        }
        else if (attributeDetails.ValidationFormat === "GREATERTHANOREQUALTODAY") {
          if (new Date(Date.parse(value)).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
            return "AttributeInfo_Date_GreaterThanOrEqualToday";
          }
        }
        else if (attributeDetails.ValidationFormat === "LESSERTHANTODAY") {
          if (new Date(Date.parse(value)).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
            return "AttributeInfo_Date_LesserThanToday";
          }
        }
        else if (attributeDetails.ValidationFormat === "LESSERTHANOREQUALTODAY") {
          if (new Date(Date.parse(value)).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
            return "AttributeInfo_Date_LesserThanOrEqualToday";
          }
        }
        else if (attributeDetails.ValidationFormat === "EQUALTODAY") {
          if (new Date(Date.parse(value)).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)) {
            return "AttributeInfo_Date_EqualToday";
          }
        }
        else if (attributeDetails.ValidationFormat === "NOTEQUALTODAY") {
          if (new Date(Date.parse(value)).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
            return "AttributeInfo_Date_NotEqualToday";
          }
        }
      }
    }
  }
  else if (attributeDetails.DataType.toLowerCase() === "string") {
    if (value !== undefined && value !== null && value.toString().trim() !== "") {
      if (attributeDetails.ValidationFormat !== "" && attributeDetails.ValidationFormat !== null && !value.toString().match(attributeDetails.ValidationFormat)) {
        return "ERRMSG_VALIDATION_FAILED";
      }
      else {
        // const normalExpression = "^[0-9a-zA-Z-_ ]+$";
        const nameExpression = /^[^!%<>?\[\]^`{}|~=*]+$/;
        if (!value.toString().match(nameExpression)) {
          return "Name_ValidInputCharacters";
        }
      }
      if (attributeDetails.MinValue !== "" && attributeDetails.MinValue !== null) {
        if (value.length < attributeDetails.MinValue) {
          return "AttributeInfo_MinValidation";
        }
      }
      if (attributeDetails.MaxValue === "" || attributeDetails.MaxValue === null) {
        if (300 < value.length) {
          return "Common_MaxLengthExceeded";
        }
      } else {
        if (attributeDetails.MaxValue < value.length) {
          return "Common_MaxLengthExceeded";
        }
      }
    }
  }
  return "";
}

export function convertStringtoDecimal(value) {
  let decimalValue = value;

  let thousandSeparator = (11111).toLocaleString().replace(/1/g, "");
  if (thousandSeparator.length > 1) {
    thousandSeparator = thousandSeparator[0];
  }
  let decimalSeparator = (1.1).toLocaleString().replace(/1/g, "");
  let decimalNumber = value.toString();

  if (thousandSeparator.trim() === "")
    decimalNumber = decimalNumber.replace(/\s/g, "");
  else
    decimalNumber = decimalNumber.replace(
      new RegExp("\\" + thousandSeparator, "g"),
      ""
    );

  if (decimalSeparator.trim() === "")
    decimalNumber = decimalNumber.replace(/\s/g, ".");
  else
    decimalNumber = decimalNumber.replace(
      new RegExp("\\" + decimalSeparator, "g"),
      "."
    );
  // let decimalNumber = value
  //   .toString()
  //   .replace(/\s/g, "")
  //    .replace(new RegExp("\\" + thousandSeparator, "g"), "")
  //   .replace(new RegExp("\\" + decimalSeparator), ".");
  if (Number(decimalNumber)) {
    decimalValue = parseFloat(decimalNumber);
  }
  return decimalValue;
}

export function getValidationErrors(
  data,
  validationDef,
  validationErrors,
  fieldDetails
) {
  validationDef.forEach(function (fieldValidation) {
    let objectKey = fieldDetails.find(function (field) {
      if (field.label === fieldValidation.label && field.visible === true)
        return field.objectKey;
    });
    if (objectKey !== undefined) {
      validationErrors[fieldValidation.label] = validateField(
        fieldValidation.validations,
        data[objectKey]
      );
    }
  });

  return validationErrors;
}

export function componentValidationStatus(validationErrors) {
  var returnValue = Object.values(validationErrors).every(function (value) {
    return value === "";
  });

  return returnValue;
}

export function transferListtoOptions(list) {
  var options = [];
  if (Array.isArray(list)) {
    list.forEach((element) => {
      options.push({ text: element, value: element });
    });
  }
  return options;
}

export function transferDictionarytoOptions(dict) {
  var options = [];

  if (dict !== null && dict !== undefined) {
    Object.keys(dict).forEach((element) => {
      options.push({ text: dict[element], value: element });
    });
  }
  return options;
}

export function transferListtoTitles(list) {
  var options = [];
  if (Array.isArray(list)) {
    list.forEach((element) => {
      options.push({ text: element, title: element });
    });
  }
  return options;
}

export function transferListtoOptionsByCode(list) {
  var options = [];

  if (Array.isArray(list))
    list.forEach((element) => {
      options.push({ text: element.Code, value: element.Code });
    });

  return options;
}

export function getInitialValidationErrors(validationDef) {
  var validationErrors = {};
  Object.keys(validationDef).forEach((key) => (validationErrors[key] = ""));
  return validationErrors;
}

export function getAttributeInitialValidationErrors(attributeMetaDataList) {
  let attributeTerminalValidationErrors = [];
  attributeMetaDataList.forEach((attributeMetaData) => {
    var attributeValidation = {};
    var attributeValidationErrors = {};
    attributeMetaData.attributeMetaDataList.forEach((attributeData) => (attributeValidationErrors[attributeData.Code] = ""));
    attributeValidation.TerminalCode = attributeMetaData.TerminalCode
    attributeValidation.attributeValidationErrors = attributeValidationErrors
    attributeTerminalValidationErrors.push(attributeValidation);
  });
  return attributeTerminalValidationErrors;
}

export function convertResultsDatatoNotification(result, title, keyNames) {
  var notification = {
    message: "",
    messageType: "",
    messageResultDetails: [], //{code,isSuccess,Errormessage}
  };

  if (result.ResultDataList !== null && result.ResultDataList !== undefined) {
    notification.message = title;
    notification.messageType = result.IsSuccess ? "success" : "critical"; //TODO:Localize
    result.ResultDataList.forEach((element) => {
      if (element != null) {
        var keyFields = [];
        var keyValues = [];
        keyNames.forEach((keyName) => {
          if (element.KeyCodes != null && element.KeyCodes.length > 0) {
            var key = element.KeyCodes.find(function (keyCode) {
              if (keyCode.Key === keyName) return keyCode;
            });

            if (key !== null && key !== undefined) {
              keyFields.push(keyName);
              keyValues.push(key.Value);
            }
          }
        });

        var isSuccess = element.IsSuccess;
        var resultError =
          element.ErrorList !== null && element.ErrorList.length > 0
            ? element.ErrorList[0]
            : "";
        var messageResultDetail = {
          keyFields: keyFields,
          keyValues: keyValues,
          isSuccess: isSuccess,
          errorMessage: resultError,
        };
      }
      notification.messageResultDetails.push(messageResultDetail);
    });
  }

  return notification;
}
export function isInFunction(FunctionList, FunctionName, FunctionGroup) {
  if (isArchive &&
    (FunctionName.toLowerCase() === "add" ||
      FunctionName.toLowerCase() === "remove" ||
      FunctionName.toLowerCase() === "modify"))
    return false;
  else
    return (FunctionList.includes(
      FunctionName.toUpperCase() + "|" + FunctionGroup.toUpperCase()
    ));
}

export function getAuthenticationObjectforGet(tokenInfo) {
  //const authType = window["runConfig"].authType;
  if (authType === 1) {
    return {
      method: "GET",
      //withCredentials: true,
      headers: {
        "content-type": "application/json",
        Authorization: tokenInfo,
      },
    };
  } else {
    return {
      method: "GET",
      withCredentials: true,
      headers: {
        "content-type": "application/json",
      },
    };
  }
  /*return {
    method: "GET",
    //withCredentials: true,
    headers: {
      "content-type": "application/json",
      Authorization: tokenInfo,
    },
  };*/
}
export function getAuthenticationObjectforPost(data, tokenInfo) {
  //const authType = window["runConfig"].authType;
  if (authType === 1) {
    return {
      method: "POST",
      //withCredentials: true,
      headers: {
        "content-type": "application/json",
        Authorization: tokenInfo,
      },
      data: data,
    };
  } else {
    return {
      method: "POST",
      withCredentials: true,
      headers: {
        "content-type": "application/json",
      },
      data: data,
    };
  }
  /*return {
    method: "POST",
    //withCredentials: true,
    headers: {
      "content-type": "application/json",
      Authorization: tokenInfo,
    },
    data: data,
  };*/
}

export function generateCompartmentCode(compartments) {
  var maxnumber = 0;
  if (compartments === null || compartments.length === 0) return 1;
  compartments.forEach((comp) => {
    var compCode = comp.Code;
    if (compCode !== null || compCode !== "") {
      if (!isNaN(parseInt(compCode))) {
        let val = parseInt(compCode);

        if (val > maxnumber) maxnumber = val;
      }
    }
  });

  return maxnumber + 1;
}

export function addSeqNumberToListObject(objectList) {
  if (!Array.isArray(objectList) || objectList.length === 0) {
    return objectList;
  } else {
    for (var i = 0; i < objectList.length; i++) {
      objectList[i].SeqNumber = i + 1;
    }
    return objectList;
  }
}

export function getMaxSeqNumberfromListObject(objectList) {
  var maxnumber = 0;
  if (!Array.isArray(objectList) || objectList.length === 0) return 1;
  objectList.forEach((object) => {
    var seqNumber = object.SeqNumber;
    if (seqNumber !== null && seqNumber !== "" && seqNumber !== undefined) {
      if (!isNaN(parseInt(seqNumber))) {
        let val = parseInt(seqNumber);

        if (val > maxnumber) maxnumber = val;
      }
    }
  });

  return maxnumber + 1;
}

export function removeSeqNumberFromListObject(objectList) {
  if (Array.isArray(objectList)) {
    objectList.forEach((object) => delete object.SeqNumber);
  }
  return objectList;
}

export function validateDateRange(toDate, fromDate) {
  if (isNaN(Date.parse(toDate))) {
    return "Common_InvalidToDate";
  }

  if (isNaN(Date.parse(fromDate))) {
    return "Common_InvalidFromDate";
  }

  if (Date.parse(fromDate) > Date.parse(toDate))
    return "Common_InvalidDateRange";

  return "";
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export const atgDisableInfo = {
  TankMode: false,
  Density: false,
  AvailableRoom: false,
  Temperature: false,
  TankLevel: false,
  GrossVolume: false,
  NetVolume: false,
  VapourGrossQuantity: false,
  VapourNetQuantity: false,
  Pressure: false,
  WaterLevel: false,
  WaterVolume: false,
  Mass: false,
  NetMass: false
}

export function attributesDatatypeConversion(attributes) {
  if (attributes !== null && attributes !== undefined && attributes.length > 0) {
    attributes.forEach(function (item) {
      item.attributeMetaDataList.forEach(function (metaData) {
        if (metaData.DefaultValue !== undefined && metaData.DefaultValue !== null && metaData.DefaultValue.toString().trim() !== "") {
          if (metaData.DataType.toLowerCase() === 'double' || metaData.DataType.toLowerCase() === 'float') {
            metaData.DefaultValue = convertStringtoDecimal(metaData.DefaultValue);
          }
          // else if (metaData.DataType.toLowerCase() === "datetime") {
          //   var Dateval = new Date(metaData.DefaultValue);
          //   metaData.DefaultValue = Dateval.getFullYear() + "-" + ("0" + (Dateval.getMonth() + 1)).slice(-2) + "-" + ("0" + Dateval.getDate()).slice(-2);
          // }
        }
      })
    })
  }
  return attributes;
}

export function attributesConvertoDecimal(attributes) {
  attributes.forEach(function (item) {
    item.attributeMetaDataList.forEach(function (metaData) {
      if (metaData.DataType.toLowerCase() === 'double' || metaData.DataType.toLowerCase() === 'float') {
        if (metaData.DefaultValue !== "" && metaData.DefaultValue !== null) {
          metaData.DefaultValue = parseFloat(metaData.DefaultValue);
        }
      }
    })
  })
  return attributes;
}

export function attributesConverttoLocaleString(attributes) {
  attributes.forEach(function (item) {
    item.attributeMetaDataList.forEach(function (metaData) {
      if (metaData.DataType.toLowerCase() === 'double' || metaData.DataType.toLowerCase() === 'float') {
        if (metaData.DefaultValue !== "" && metaData.DefaultValue !== null)
          metaData.DefaultValue = metaData.DefaultValue.toLocaleString();
      }
    })
  })
  return attributes;
}

export function compartmentAttributesConverttoLocaleString(attributes) {
  attributes.forEach(function (item) {
    if (item.DataType.toLowerCase() === 'double' || item.DataType.toLowerCase() === 'float') {
      if (item.AttributeValue !== "" && item.AttributeValue !== null)
        item.AttributeValue = item.AttributeValue.toLocaleString();
    }
  })
  return attributes;
}

export function compartmentAttributesDatatypeConversion(attributes) {
  attributes.forEach(function (item) {
    if (item.AttributeValue !== undefined && item.AttributeValue !== null && item.AttributeValue.toString().trim() !== "") {
      if (item.DataType.toLowerCase() === 'double' || item.DataType.toLowerCase() === 'float') {
        item.AttributeValue = convertStringtoDecimal(item.AttributeValue);
      }
      // else if (item.DataType.toLowerCase() === "datetime") {
      //   var Dateval = new Date(item.AttributeValue);
      //   item.AttributeValue = Dateval.getFullYear() + "-" + ("0" + (Dateval.getMonth() + 1)).slice(-2) + "-" + ("0" + Dateval.getDate()).slice(-2);
      // }
    }

  })
  return attributes;
}

export function compartmentAttributesConvertoDecimal(attributes) {
  attributes.forEach(function (item) {
    if (item.DataType.toLowerCase() === 'double' || item.DataType.toLowerCase() === 'float') {
      if (item.AttributeValue !== "" && item.AttributeValue !== null) {
        item.AttributeValue = parseFloat(item.AttributeValue);
      }
    }
  })
  return attributes;
}


export function getSlotParameters(validationDef) {
  var slotParams = {};
  Object.keys(validationDef).forEach((key) => (slotParams[key] = {
    Value: "",
    DefaultValue: "",
    Description: ""
  }));
  return slotParams;
}

export function convertDatesToString(dateFields, entity) {
  try {
    if (dateFields !== undefined && entity !== undefined &&
      dateFields.length > 0 && entity !== '') {
      //debugger;
      Object.values(dateFields).forEach(function (value) {
        //console.log("key", entity[value]);
        if (entity[value] !== undefined && entity[value] !== null && entity[value] !== '') {
          //debugger;
          entity[value] = dayjs(entity[value]).format("YYYY-MM-DD");
        }
        else {
          entity[value] = null;
        }
      });
    }
  }
  catch (error) {
    console.log("Error in convertDatesToString-", error);

  }
  return entity;
}


export function convertStringToDates(dateFields, entity) {
  try {
    if (dateFields !== undefined && entity !== undefined &&
      dateFields.length > 0 && entity !== '') {
      Object.values(dateFields).forEach(function (value) {
        //console.log("key",entity[value]);
        if (entity[value] !== undefined && entity[value] !== null && entity[value] !== ''
          && entity[value].toString().includes("-")) {
          //debugger;
          //console.log("Before",entity[value]);
          //entity[value].toString().split('-')
          //debugger;
          entity[value] = new Date(entity[value].toString().split('-')[0],
            (entity[value].toString().split('-')[1] - 1), entity[value].toString().split('-')[2], 0, 0, 0, 0);
          //console.log("After",entity[value]);
        }
      });
    }
  }
  catch (error) {
    console.log("Error in convertStringToDates-", error);

  }
  return entity;
}

export function fillAttributeDetails(attributeList) {
  let attributes = [];
  if (attributeList.length > 0 && Array.isArray(attributeList)) {
    attributeList.forEach((comp) => {
      let attribute = {
        ListOfAttributeData: [],
      };
      attribute.TerminalCode = comp.TerminalCode;
      if (comp.attributeMetaDataList.length > 0 && Array.isArray(comp.attributeMetaDataList)) {
        comp.attributeMetaDataList.forEach((attributeData) => {
          attribute.ListOfAttributeData.push({
            AttributeCode: attributeData.Code,
            AttributeValue: attributeData.DefaultValue,
          });
        });
        attributes.push(attribute);
      }
    });
  }
  return attributes;
}

export function convertStringToCommonDateFormat(strdate) {
  try {
    // debugger;
    var validDate = strdate;
    if (strdate !== undefined && strdate !== '' && typeof strdate === "string" && strdate.toString().includes('-')) {
      validDate = new Date(strdate.toString().split('-')[0],
        (strdate.toString().split('-')[1] - 1), strdate.toString().split('-')[2], 0, 0, 0, 0);
    }
  }
  catch (error) {
    console.log("Error in convertStringToCommonDateFormat-", error);

  }
  return validDate;
}

export function clearSessionStorage(itemKey) {
  sessionStorage.removeItem(itemKey);
}
export function transferCommaStringtoOptions(str) {
  var options = [];

  if (str !== null && str !== undefined) {
    options = str.split(",")
  }
  return options;
}

export function isPasswordEnabled(FunctionList, FunctionName, FunctionGroup) {
  var index = FunctionList.findIndex(item => {
    return item.Groupname.toLowerCase() === FunctionGroup.toLowerCase()
  })

  if (index >= 0) {
    let funcIndex = FunctionList[index].functionInfo.findIndex(x => {
      return x.functionName.toLowerCase() === FunctionName.toLowerCase()
    });

    if (funcIndex >= 0) {
      return FunctionList[index].functionInfo[funcIndex].isPasswordRequired;
    }
    else return false;
  }
  else return false;
}
export function getSiteViewFunctionGroup(transportationtype) {
  let functionGroup = "SiteView";
  if (
    transportationtype !== undefined &&
    transportationtype !== null &&
    transportationtype.toString().trim() !== ""
  ) {
    if (transportationtype.toLowerCase() === "road") {
      functionGroup = "SiteView";
    } else if (transportationtype.toLowerCase() === "rail") {
      functionGroup = "RailSiteView";
    } else if (transportationtype.toLowerCase() === "marine") {
      functionGroup = "MarineSiteView";
    }
  }
  return functionGroup;
}

export function DateDiffInDays(fromDate, toDate) {
  return Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24));
}