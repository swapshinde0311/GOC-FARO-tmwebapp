import React, { Component } from "react";
import { AutoAccessIDAssociationDetails } from "../../UIBase/Details/AutoAccessIDAssociationDetails";
import { AutoACLocationDetails } from "../../UIBase/Details/AutoACLocationDetails";
import { AutoACDetailsSectionDetails } from "../../UIBase/Details/AutoACDetailsSectionDetails";
import {
  accessIDValidationDef,
  accessIDSectionValidationDef,
} from "../../../JS/ValidationDef";
import * as Utilities from "../../../JS/Utilities";
import { emptyAccessCard } from "../../../JS/DefaultEntities";
import NotifyEvent from "../../../JS/NotifyEvent";
import { toast } from "react-toastify";
import axios from "axios";
import * as Constants from "../../../JS/Constants";
import * as RestApis from "../../../JS/RestApis";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import TMDetailsHeader from "../../UIBase/Common/TMDetailsHeader";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";
import {
  functionGroups,
  fnAutoIDAssociation,
  fnIssueCard,
  fnActivateCard,
  fnRevokeCard,
} from "../../../JS/FunctionGroups";
import lodash from "lodash";
import { accessCardAttributeEntity } from "../../../JS/AttributeEntity";
import { TranslationConsumer } from "@scuf/localization";
import UserAuthenticationLayout from "../Common/UserAuthentication";
import * as DateFieldsInEntities from "../../../JS/DateFieldsInEntities";

class AutoAccessIDAssociationDetailsComposite extends Component {
  state = {
    location: [],
    temporaryCard: lodash.cloneDeep(emptyAccessCard),
    modTemporaryCard: lodash.cloneDeep(emptyAccessCard),
    validationSectionErrors: Utilities.getInitialValidationErrors(
      accessIDSectionValidationDef
    ),
    validationIDErrors: Utilities.getInitialValidationErrors(
      accessIDValidationDef
    ),
    saveEnabled: true,
    issueEnabled: false,
    activateEnable: false,
    revokeEnable: false,
    carrierCompanies: [],
    entityValues: [],
    entityTypes: [],
    cardReadTime: null,
    TWICEnabled: null,
    PIN: null,
    attribute: [],
    attributeMetaDataList: [],
    modAttributeMetaDataList: [],
    attributeValidationErrors: [],
    PointName: null,
    ReadStartTime: null,
    CardNumber: "",
    isShow: false,
    defaultShow: true,

    tempTemporaryCard : {},

    showAccessCardAuthenticationLayout: false,
    showIssueAuthenticationLayout: false,
    showRevokeAuthenticationLayout: false,
    showActivateAuthenticationLayout: false,
     
  };

  initializeTheButtonEnable() {
    Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
    var { issueEnabled } = { ...this.state };
    var { activateEnable } = { ...this.state };
    var { revokeEnable } = { ...this.state };
    var { saveEnabled } = { ...this.state };
    issueEnabled = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnIssueCard
    );
    activateEnable = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnActivateCard
    );
    revokeEnable = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnRevokeCard
    );
    saveEnabled = Utilities.isInFunction(
      this.props.userDetails.EntityResult.FunctionsList,
      functionGroups.modify,
      fnAutoIDAssociation
    );
    this.setState({
      issueEnabled,
      activateEnable,
      revokeEnable,
      saveEnabled,
    });
  }

  componentDidMount() {
    try {
      this.initializeTheButtonEnable();
      this.getCarrierCompanies(this.props.selectedShareholder);
      this.getEntityTypeList(this.props.selectedShareholder);
      this.getAttributes();
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      // if (
      //   // this.state.temporaryCard.PIN !== "" &&
      //   nextProps.CardNumber !== "" &&
      //   this.props.tokenDetails.tokenInfo === nextProps.tokenDetails.tokenInfo
      // ) {
      //   this.getAccessCard(nextProps.CardNumber);
      // }
      if (nextProps.location.length !== 0) {
        const { modTemporaryCard } = this.state;
        let PointName = null;
        modTemporaryCard.PointName = nextProps.location[0][3];
        PointName = nextProps.location[0][3];
        this.setState({
          location: nextProps.location[0],
          modTemporaryCard,
          PointName,
        });
        this.getEntityTypeList(this.props.selectedShareholder);
      }
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }

  getAttributes() {
    try {
      axios(
        RestApis.GetAttributesMetaData,
        Utilities.getAuthenticationObjectforPost(
          [accessCardAttributeEntity],
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (
            result.EntityResult.accessCard === null ||
            result.EntityResult.accessCard === undefined
          ) {
            result.EntityResult.accessCard = [];
          }
          this.setState(
            {
              attributeMetaDataList: lodash.cloneDeep(
                result.EntityResult.accessCard
              ),
              attributeValidationErrors:
                Utilities.getAttributeInitialValidationErrors(
                  result.EntityResult.accessCard
                ),
            },
            () => {
              if (
                this.props.userDetails.EntityResult.IsEnterpriseNode === false
              )
                this.localNodeAttribute();
            }
            // () => this.getAccessCard(this.CardNumber)
          );
        } else {
          console.log("Failed to get Attributes");
        }
      });
    } catch (error) {
      console.log("Error while getting Attributes:", error);
    }
  }

  getAccessCard(CardNumber) {
    emptyAccessCard.ShareholderCode = this.props.selectedShareholder;
    var CardCode = CardNumber;
    if (CardCode === undefined) {
      this.setState(
        {
          temporaryCard: lodash.cloneDeep(emptyAccessCard),
          modTemporaryCard: lodash.cloneDeep(emptyAccessCard),
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnAutoIDAssociation
          ),
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode === false)
            this.localNodeAttribute();
        }
      );
      return;
    }
    var keyCode = [
      {
        key: KeyCodes.accessCardCode,
        value: CardCode,
      },
    ];
    var obj = {
      ShareholderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: keyCode,
    };

    axios(
      RestApis.GetAccessCard,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let accessCard = lodash.cloneDeep(result.EntityResult);
          if (result.EntityResult.Password !== null) {
            accessCard.Password = null;
          }
          this.setState(
            {
              temporaryCard: accessCard,
              modTemporaryCard: accessCard,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnAutoIDAssociation
              ),
            },
            () => {
              if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
                this.terminalSelectionChange(result.EntityResult.TerminalCodes);
              } else {
                this.localNodeAttribute();
              }
            }
          );
          if (
            result.EntityResult.FASCN !== null &&
            result.EntityResult.FASCN !== ""
          ) {
            let modTemporaryCard = lodash.cloneDeep(
              this.state.modTemporaryCard
            );
            modTemporaryCard.ISTWICCARD = true;
            this.setState(modTemporaryCard);
          }
        } else {
          let modTemporaryCard = lodash.cloneDeep(emptyAccessCard);
          modTemporaryCard.PIN = CardCode;
          modTemporaryCard.CardType = "ELECTRONIC";
          this.setState(
            {
              temporaryCard: lodash.cloneDeep(emptyAccessCard),
              modTemporaryCard,
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnAutoIDAssociation
              ),
            },
            () => {
              if (
                this.props.userDetails.EntityResult.IsEnterpriseNode === false
              )
                this.localNodeAttribute();
            }
          );
          console.log("Error in GetAccessCard:", result.ErrorList);
        }
        this.getTWICEnabled();
        this.getEntityCodesByCarrierAndEntityType(
          this.props.selectedShareholder
        );
      })
      .catch((error) => {
        console.log("Error while getting AccessCard:", error);
      });
  }

  localNodeAttribute() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      if (Array.isArray(attributeMetaDataList) && attributeMetaDataList.length > 0) {
        this.terminalSelectionChange([attributeMetaDataList[0].TerminalCode]);
      }
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on localNodeAttribute",
        error
      );
    }
  }

  terminalSelectionChange(selectedTerminals) {
    try {
      let attributesTerminalsList = [];
      var attributeMetaDataList = [];
      var modAttributeMetaDataList = [];

      attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      // modAttributeMetaDataList = lodash.cloneDeep(
      //   this.state.modAttributeMetaDataList
      // );
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      var modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
      selectedTerminals.forEach((terminal) => {
        var existitem = modAttributeMetaDataList.find((selectedAttribute) => {
          return selectedAttribute.TerminalCode === terminal;
        });
        if (existitem === undefined) {
          attributeMetaDataList.forEach(function (attributeMetaData) {
            if (attributeMetaData.TerminalCode === terminal) {
              var Attributevalue = modTemporaryCard.Attributes.find(
                (modTemporaryCardAttribute) => {
                  return modTemporaryCardAttribute.TerminalCode === terminal;
                }
              );
              if (Attributevalue !== undefined) {
                attributeMetaData.attributeMetaDataList.forEach(function (
                  attributeMetaData
                ) {
                  var valueAttribute = Attributevalue.ListOfAttributeData.find(
                    (x) => {
                      return x.AttributeCode === attributeMetaData.Code;
                    }
                  );
                  if (valueAttribute !== undefined)
                    attributeMetaData.DefaultValue =
                      valueAttribute.AttributeValue;
                });
              }
              attributesTerminalsList.push(attributeMetaData);
            }
          });
        } else {
          attributesTerminalsList.push(existitem);
        }
      });

      modAttributeMetaDataList = [];
      modAttributeMetaDataList = attributesTerminalsList;

      attributeValidationErrors.forEach((attributeValidation) => {
        var existTerminal = selectedTerminals.find((selectedTerminals) => {
          return attributeValidation.TerminalCode === selectedTerminals;
        });
        if (existTerminal === undefined) {
          Object.keys(attributeValidation.attributeValidationErrors).forEach(
            (key) => (attributeValidation.attributeValidationErrors[key] = "")
          );
        }
      });

      this.setState({ modAttributeMetaDataList, attributeValidationErrors });
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on terminalSelectionChange",
        error
      );
    }
  }

  getTWICEnabled() {
    axios(
      RestApis.GetTWICEnabled,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          this.setState({
            TWICEnabled: result.EntityResult,
          });
        }
      })
      .catch((error) => {
        console.log("Error while getting TWIC Enabled:", error);
      });
  }

  getCarrierCompanies(shareholder) {
    axios(
      RestApis.GetAllCarrierListForRole + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          let carrierCompanies = [];
          if (result.EntityResult !== null) {
            Object.keys(result.EntityResult.Table2).forEach((key) =>
              carrierCompanies.push(result.EntityResult.Table2[key].Code)
            );
            this.setState({ carrierCompanies });
          } else {
            console.log("No carrierCompanies identified.");
          }
        } else {
          console.log("Error in GetAllCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  getEntityTypeList(shareholder) {
    axios(
      RestApis.GetEntityTypeList + "?ShareholderCode=" + shareholder,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            var entityTypes = [];
            var tempEntityTypes = result.EntityResult;
            if (
              this.state.location[0] !== undefined &&
              this.state.location[0].toLowerCase().indexOf("twic") !== -1
            ) {
              if (
                tempEntityTypes.indexOf(
                  Constants.AccessCardEntityType.PrimeMover
                ) !== -1
              )
                tempEntityTypes.remove(
                  Constants.AccessCardEntityType.PrimeMover
                );
              if (
                tempEntityTypes.indexOf(
                  Constants.AccessCardEntityType.RailWagon
                ) !== -1
              )
                tempEntityTypes.remove(
                  Constants.AccessCardEntityType.RailWagon
                );
              if (
                tempEntityTypes.indexOf(
                  Constants.AccessCardEntityType.Trailer
                ) !== -1
              )
                tempEntityTypes.remove(Constants.AccessCardEntityType.Trailer);
              if (
                tempEntityTypes.indexOf(
                  Constants.AccessCardEntityType.Vehicle
                ) !== -1
              )
                tempEntityTypes.remove(Constants.AccessCardEntityType.Vehicle);
            }

            entityTypes = tempEntityTypes;
            this.setState({ entityTypes });
          } else {
            console.log("No entityTypes identified.");
          }
        } else {
          console.log("Error in GetAllCarrierListForRole:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting Carrier List:", error);
      });
  }

  getEntityCodesByCarrierAndEntityType(shareholder) {
    const { modTemporaryCard } = this.state;
    if (this.props.selectedShareholder === null) {
      return;
    }
    if (
      modTemporaryCard.CarrierCode === undefined ||
      modTemporaryCard.EntityName === undefined
    ) {
      return;
    }
    axios(
      RestApis.GetEntityCodesByCarrierAndEntityType +
        "?ShareholderCode=" +
        shareholder +
        "&CarrierCode=" +
        modTemporaryCard.CarrierCode +
        "&EntityType=" +
        modTemporaryCard.EntityName,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          if (result.EntityResult !== null) {
            this.setState({
              entityValues: result.EntityResult,
            });
          } else {
            console.log("No entityValues identified.");
          }
        } else {
          console.log("Error in entityValues:", result.ErrorList);
        }
      })
      .catch((error) => {
        console.log("Error while getting entity code:", error);
      });
  }

  onEntitySelectFocus = () => {
    const { modTemporaryCard } = this.state;
    var validationSectionErrors = lodash.cloneDeep(
      this.state.validationSectionErrors
    );
    validationSectionErrors["EntityValue"] = "";
    Object.keys(accessIDSectionValidationDef).forEach(function (key) {
      if (key === "EntityName")
        validationSectionErrors[key] = Utilities.validateField(
          accessIDSectionValidationDef[key],
          modTemporaryCard[key]
        );
    });
    this.setState({ validationSectionErrors });
    var returnValue = Object.values(validationSectionErrors).every(function (
      value
    ) {
      return value === "";
    });
    if (returnValue) {
      axios(
        RestApis.GetEntityCodesByCarrierAndEntityType +
          "?ShareholderCode=" +
          this.props.selectedShareholder +
          "&CarrierCode=" +
          modTemporaryCard.CarrierCode +
          "&EntityType=" +
          modTemporaryCard.EntityName,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          if (result.IsSuccess === true) {
            this.setState({
              entityValues: result.EntityResult,
            });
          } else {
            console.log("Error in onEntitySelectFocus:", result.ErrorList);
          }
        })
        .catch((error) => {
          console.log("Error while getting Entity Code:", error);
        });
    }
  };

  handleSectionChange = (propertyName, data) => {
    try {
      const modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
      const validationSectionErrors = lodash.cloneDeep(
        this.state.validationSectionErrors
      );
      modTemporaryCard[propertyName] = data;
      if (propertyName === "EntityName" && data !== null) {
        modTemporaryCard["EntityValue"] = "";
        this.setState({ modTemporaryCard }, () => this.onEntitySelectFocus());
      } else {
        this.setState({ modTemporaryCard });
      }
      if (propertyName === "CarrierCode" && data !== null) {
        if (modTemporaryCard.EntityName !== null) {
          this.setState({ modTemporaryCard }, () => this.onEntitySelectFocus());
        }
      }
      if (accessIDSectionValidationDef[propertyName] !== undefined) {
        validationSectionErrors[propertyName] = Utilities.validateField(
          accessIDSectionValidationDef[propertyName],
          data
        );
        if (propertyName === "EntityName") {
          if (
            data === Constants.CommonEntityType.TMUser ||
            data === Constants.CommonEntityType.Staff ||
            data === Constants.CommonEntityType.Visitor
          ) {
            modTemporaryCard.CarrierCode = null;
            this.setState({ modTemporaryCard });
            validationSectionErrors["CarrierCode"] = "";
          }
        } else {
          if (
            propertyName === "EntityValue" &&
            (modTemporaryCard.EntityName ===
              Constants.CommonEntityType.TMUser ||
              modTemporaryCard.EntityName ===
                Constants.CommonEntityType.Staff ||
              modTemporaryCard.EntityName ===
                Constants.CommonEntityType.Visitor)
          ) {
            validationSectionErrors["CarrierCode"] = "";
          }
        }
        this.setState({ validationSectionErrors });
      }
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on handleSectionChange",
        error
      );
    }
  };

  modifyReadByWorkflow = () => {
    const PointName = lodash.cloneDeep(this.state.PointName);
    const modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
    modTemporaryCard.PointName = this.state.PointName;
    if (PointName !== undefined && PointName !== null) {
      axios(
        RestApis.ModifyReadByWorkflow + "?accessIDPointName=" + PointName,
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        this.setState({ ReadStartTime: result.EntityResult });
        if (result.IsSuccess !== true) {
          console.log("Error in ModifyReadByWorkflow:", result.ErrorList);
        }
      });
    }
  };

  componentWillUnmount() {
    this.timerStop();
  }

  timerStart = () => {
    timer = setInterval(() => {
      this.readCardData(this.props.userDetails.EntityResult.PrimaryShareholder);
    }, 3000);
  };

  timerStop = () => {
    clearInterval(timer);
  };

  handleShowCard = () => {
    try {
      const validationIDErrors = { ...this.state.validationIDErrors };
      const temporaryCard = lodash.cloneDeep(this.state.temporaryCard);
      Object.keys(validationIDErrors).forEach(function (key) {
        validationIDErrors[key] = "";
      });
      this.timerStop();
      this.modifyReadByWorkflow();
      this.setState({
        modTemporaryCard: { ...temporaryCard },
        validationIDErrors,
        isShow: true,
        defaultShow: false,
      });
      this.timerStart();
    } catch (error) {
      console.log(
        "temporaryCardDetailsComposite:Error occured on handleShowCard",
        error
      );
    }
  };

  readCardData(shareholder) {
    try {
      if (
        shareholder !== undefined &&
        shareholder !== "" &&
        this.state.location.length > 0 &&
        this.state.ReadStartTime !== null
      ) {
        var keyCode = [
          {
            key: KeyCodes.cardReaderCode,
            value: this.state.location[0],
          },
          {
            key: "ReadStartTime",
            value: this.state.ReadStartTime,
          },
        ];
        var obj = {
          ShareholderCode: shareholder,
          keyDataCode: KeyCodes.accessCardCode,
          KeyCodes: keyCode,
        };

        axios(
          RestApis.ReadCardData,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            var result = response.data;
            if (result.IsSuccess === true) {
              if (result.EntityResult !== null) {
                this.setState({
                  cardReadTime: result.EntityResult.CardDetectionTime,
                  CardNumber: result.EntityResult.CardNumber,
                  isReadyToRender: true,
                  isShow: false,
                });
                this.getAccessCard(this.state.CardNumber);
              }
              this.timerStop();
            } else {
              this.setState({
                CardNumber: "",
                isReadyToRender: true,
              });
              console.log("Error in ReadCardData:", result.ErrorList);
            }
          })
          .catch((error) => {
            this.setState({
              CardNumber: "",
              isReadyToRender: true,
            });
            console.log("Error while read card data:", error);
          });
      }
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationComposite:Error occured on readCardData",
        error
      );
    }
  }

  handleIDChange = (propertyName, data) => {
    try {
      const modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
      const validationIDErrors = lodash.cloneDeep(
        this.state.validationIDErrors
      );
      modTemporaryCard[propertyName] = data;
      if (propertyName === "ISTWICCARD" && data === false) {
        validationIDErrors["FASCN"] = "";
        modTemporaryCard.FASCN = "";
        this.setState({
          validationIDErrors,
          modTemporaryCard,
          PIN: null,
        });
      } else {
        this.setState({ modTemporaryCard });
      }
      if (accessIDValidationDef[propertyName] !== undefined) {
        validationIDErrors[propertyName] = Utilities.validateField(
          accessIDValidationDef[propertyName],
          data
        );
        this.setState({ validationIDErrors });
      }
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on handleIDChange",
        error
      );
    }
  };

  handleDateTextChange = (propertyName, value, error) => {
    try {
      var validationIDErrors = { ...this.state.validationIDErrors };
      var modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
      validationIDErrors[propertyName] = error;
      modTemporaryCard[propertyName] = value;
      this.setState({ validationIDErrors, modTemporaryCard });
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on handleDateTextChange",
        error
      );
    }
  };

  handleAttributeDataChange = (attribute, value) => {
    try {
      let matchedAttributes = [];
      let modAttributeMetaDataList = lodash.cloneDeep(
        this.state.modAttributeMetaDataList
      );
      let matchedAttributesList = modAttributeMetaDataList.filter(
        (modattribute) => modattribute.TerminalCode === attribute.TerminalCode
      );
      if (
        matchedAttributesList.length > 0 &&
        Array.isArray(matchedAttributesList[0].attributeMetaDataList)
      ) {
        matchedAttributes =
          matchedAttributesList[0].attributeMetaDataList.filter(
            (modattribute) => modattribute.Code === attribute.Code
          );
      }
      if (matchedAttributes.length > 0) {
        matchedAttributes[0].DefaultValue = value;
      }
      const attributeValidationErrors = lodash.cloneDeep(
        this.state.attributeValidationErrors
      );

      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attributeValidation.attributeValidationErrors[attribute.Code] =
            Utilities.valiateAttributeField(attribute, value);
        }
      });
      this.setState({ attributeValidationErrors,modAttributeMetaDataList });
      if (
        attribute.DataType === Constants.AttributeTypes.INT ||
        attribute.DataType === Constants.AttributeTypes.LONG ||
        attribute.DataType === Constants.AttributeTypes.FLOAT ||
        attribute.DataType === Constants.AttributeTypes.DOUBLE
      ) {
        value = Utilities.convertStringtoDecimal(value);
      }
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on handleAttributeDataChange",
        error
      );
    }
  };

  saveAccessCard = () => {
    try {
      this.setState({ saveEnabled: false });
      let tempTemporaryCard = lodash.cloneDeep(this.state.tempTemporaryCard);

      tempTemporaryCard.CardStatus === null
      ? this.createTemporaryCard(tempTemporaryCard)
      : this.updateTemporaryCard(tempTemporaryCard);

    } catch (error) {
      console.log("AutoAccessCardComposite : Error in saveAutoAccessCard");
    }
  };

  handleSave = () => {
    try {
      let modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
     
      let attributeList = lodash.cloneDeep(this.state.modAttributeMetaDataList);
      modTemporaryCard.Attributes = Utilities.fillAttributeDetails(attributeList);
      if (this.validateSave(modTemporaryCard)) {
        modTemporaryCard = Utilities.convertDatesToString(
          DateFieldsInEntities.DatesInEntity.AccessCard,
          modTemporaryCard
        );

        let showAccessCardAuthenticationLayout =
        this.props.userDetails.EntityResult.IsWebPortalUser !== true
          ? true
          : false;
      let tempTemporaryCard = lodash.cloneDeep(modTemporaryCard);
      this.setState({ showAccessCardAuthenticationLayout, tempTemporaryCard }, () => {
        if (showAccessCardAuthenticationLayout === false) {
          this.saveAccessCard();
        }
    });

      } else {
        this.setState({ saveEnabled: true });
      }
    } catch (error) {
      console.log(
        "AutoAccessIDAssociationDetailsComposite:Error occured on handleSave",
        error
      );
    }
  };

  validateSave(modTemporaryCards) {
    var validationIDErrors = lodash.cloneDeep(this.state.validationIDErrors);
    Object.keys(accessIDValidationDef).forEach(function (key) {
      if (key !== "FASCN")
        validationIDErrors[key] = Utilities.validateField(
          accessIDValidationDef[key],
          modTemporaryCards[key]
        );
    });
    if (
      modTemporaryCards.ShareholderCode === null ||
      modTemporaryCards.ShareholderCode.trim() === ""
    )
      validationIDErrors["ShareholderCode"] =
        "MarineReceipt_MandatoryShareholder";

    if (modTemporaryCards.Locked === true) {
      if (
        modTemporaryCards.Remarks === null ||
        modTemporaryCards.Remarks === ""
      ) {
        validationIDErrors["Remarks"] = "AdditiveInjectorInfo_RemarkRequired";
      }
    }

    var attributeValidationErrors = lodash.cloneDeep(
      this.state.attributeValidationErrors
    );
    let attributeList = lodash.cloneDeep(this.state.modAttributeMetaDataList);
    attributeList.forEach((attribute) => {
      attributeValidationErrors.forEach((attributeValidation) => {
        if (attributeValidation.TerminalCode === attribute.TerminalCode) {
          attribute.attributeMetaDataList.forEach((attributeMetaData) => {
            attributeValidation.attributeValidationErrors[
              attributeMetaData.Code
            ] = Utilities.valiateAttributeField(
              attributeMetaData,
              attributeMetaData.DefaultValue
            );
          });
        }
      });
    });
    this.setState({ validationIDErrors, attributeValidationErrors });
    let returnValue = true;
    attributeValidationErrors.forEach((x) => {
      if (returnValue) {
        returnValue = Object.values(x.attributeValidationErrors).every(
          function (value) {
            return value === "";
          }
        );
      } else {
        return returnValue;
      }
    });

    if (returnValue)
      returnValue = Object.values(validationIDErrors).every(function (value) {
        return value === "";
      });
    else return returnValue;
    return returnValue;
  }

  createTemporaryCard(modTemporaryCard) {
    modTemporaryCard.ShareholderCode = this.props.selectedShareholder;
    modTemporaryCard.CardStatus = Constants.CardStatus.AVAILABLE;
    if (this.state.PIN !== null) {
      modTemporaryCard.PIN = this.state.PIN;
      modTemporaryCard.LogicalPIN = this.state.PIN;
    }
    var keyCode = [
      {
        key: KeyCodes.accessCardCode,
        value: modTemporaryCard.PIN,
      },
    ];
    var obj = {
      ShareholderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: keyCode,
      Entity: modTemporaryCard,
    };
    var notification = {
      messageType: "critical",
      message: "AutoIDAssociation_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["AccessCardInfo_x_Title"],
          keyValues: [modTemporaryCard.PIN],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.CreateAccessCard,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.modifyReadByWorkflow();
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnAutoIDAssociation
              ),
              showAccessCardAuthenticationLayout: false,
            },
            () => this.getAccessCard(modTemporaryCard.PIN)
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.add,
              fnAutoIDAssociation
            ),
            showAccessCardAuthenticationLayout: false,
          });
          console.log("Error in CreateTemporaryCard:", result.ErrorList);
        }
        this.props.onSaved(modTemporaryCard, "add", notification);
      })
      .catch((error) => {
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.add,
            fnAutoIDAssociation
          ),
          showAccessCardAuthenticationLayout: false,
        });
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modTemporaryCard, "add", notification);
      });
  }

  updateTemporaryCard(modTemporaryCard) {
    modTemporaryCard.ShareholderCode = this.props.selectedShareholder;

    modTemporaryCard = Utilities.convertDatesToString(
      DateFieldsInEntities.DatesInEntity.AccessCard,
      modTemporaryCard
    );

    let keyCode = [
      {
        key: KeyCodes.accessCardCode,
        value: modTemporaryCard.PIN,
      },
    ];

    let obj = {
      ShareholderCode: this.props.selectedShareholder,
      keyDataCode: KeyCodes.accessCardCode,
      KeyCodes: keyCode,
      Entity: modTemporaryCard,
    };

    let notification = {
      messageType: "critical",
      message: "AutoIDAssociation_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["AccessCardInfo_x_Title"],
          keyValues: [modTemporaryCard.PIN],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestApis.UpdateAccessCard,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        var result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          this.modifyReadByWorkflow();
          this.setState(
            {
              saveEnabled: Utilities.isInFunction(
                this.props.userDetails.EntityResult.FunctionsList,
                functionGroups.modify,
                fnAutoIDAssociation
              ),
              showAccessCardAuthenticationLayout: false,
            },
            () => this.getAccessCard(modTemporaryCard.PIN)
          );
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({
            saveEnabled: Utilities.isInFunction(
              this.props.userDetails.EntityResult.FunctionsList,
              functionGroups.modify,
              fnAutoIDAssociation
            ),
            showAccessCardAuthenticationLayout: false,
          });
          console.log("Error in UpdatetemporaryCard:", result.ErrorList);
        }
        this.props.onSaved(modTemporaryCard, "update", notification);
      })
      .catch((error) => {
        notification.messageResultDetails[0].errorMessage = error;
        this.props.onSaved(modTemporaryCard, "modify", notification);
        this.setState({
          saveEnabled: Utilities.isInFunction(
            this.props.userDetails.EntityResult.FunctionsList,
            functionGroups.modify,
            fnAutoIDAssociation
          ),
          showAccessCardAuthenticationLayout: false,
        });
      });
  }

  validateFASCN() {
    const modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
    const validationIDErrors = lodash.cloneDeep(this.state.validationIDErrors);
    if (modTemporaryCard.ISTWICCARD === false) {
      validationIDErrors["FASCN"] = "";
      this.setState({ validationIDErrors });
      return;
    }
    var FASCN = modTemporaryCard.FASCN;
    if (FASCN !== undefined) {
      var keyCode = [
        {
          key: "FASCN",
          value: FASCN,
        },
      ];
      var obj = {
        ShareholderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.accessCardCode,
        KeyCodes: keyCode,
      };
      var notification = {
        messageType: "critical",
        message: "AutoIDAssociation_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_FASCN"],
            keyValues: [FASCN],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      this.setState({
        saveEnabled: false,
      });
      axios(
        RestApis.ValidateFASCN,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.setState({ PIN: result.EntityResult, saveEnabled: true });
            return true;
          } else {
            // notification.messageResultDetails[0].errorMessage =
            //   result.ErrorList[0];
            // toast(
            //   <ErrorBoundary>
            //     <NotifyEvent notificationMessage={notification}></NotifyEvent>
            //   </ErrorBoundary>,
            //   {
            //     autoClose:
            //       notification.messageType === "critical" ? 10000 : false,
            //   }
            // );
            validationIDErrors["FASCN"] = "AccessCardInfo_InvalidFASCN";
            this.setState({ validationIDErrors, saveEnabled: true });
          }
        })
        .catch((error) => {
          console.log("Error while validateFASCN:", error);
        });
    }
  }

  onFASCNBlur = () => {
    this.validateFASCN();
  };

  handleReset = () => {
    try {
      this.modifyReadByWorkflow();
      const validationIDErrors = { ...this.state.validationIDErrors };
      const temporaryCard = lodash.cloneDeep(this.state.temporaryCard);
      Object.keys(validationIDErrors).forEach(function (key) {
        validationIDErrors[key] = "";
      });
      this.setState(
        {
          modTemporaryCard: { ...temporaryCard },
          validationIDErrors,
        },
        () => {
          if (this.props.userDetails.EntityResult.IsEnterpriseNode) {
            this.terminalSelectionChange(
              this.state.modTemporaryCard.TerminalCodes
            );
            this.handleResetAttributeValidationError();
          } else {
            this.localNodeAttribute();
            this.handleResetAttributeValidationError();
          }
        }
      );
    } catch (error) {
      console.log(
        "temporaryCardDetailsComposite:Error occured on handleReset",
        error
      );
    }
  };

  handleResetAttributeValidationError() {
    try {
      var attributeMetaDataList = lodash.cloneDeep(
        this.state.attributeMetaDataList
      );
      this.setState({
        attributeValidationErrors:
          Utilities.getAttributeInitialValidationErrors(attributeMetaDataList),
      });
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on handleResetAttributeValidationError",
        error
      );
    }
  }

  IssueAccessCard= () => {
    
    this.setState({ issueEnabled: false });
    
    if (this.validateIssue()) {
      
      let showIssueAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

      this.setState({ showIssueAuthenticationLayout, }, () => {
        if (showIssueAuthenticationLayout === false) {
          this.handleIssueID();
        }
    });
    }
    else 
    {
      this.setState({ issueEnabled: true });
    }
  }
  

  handleIssueID = () => {
    this.handleAuthenticationClose();
    try {
      this.initializeTheButtonEnable();
      let modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
     
      var keyCode = [
        {
          key: KeyCodes.accessCardCode,
          value: modTemporaryCard.PIN,
        },
        {
          key: KeyCodes.entityCode,
          value: modTemporaryCard.EntityValue,
        },
        {
          key: KeyCodes.entityType,
          value: modTemporaryCard.EntityName,
        },
        {
          key: KeyCodes.carrierCode,
          value: modTemporaryCard.CarrierCode
        }
      ];
      var obj = {
        ShareholderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.accessCardCode,
        KeyCodes: keyCode,
      };
      let notification = {
        messageType: "critical",
        message: "AutoIDAssociation_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_x_Title"],
            keyValues: [modTemporaryCard.PIN],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      
        axios(
          RestApis.IssueAccessCardAutoID,
          Utilities.getAuthenticationObjectforPost(
            obj,
            this.props.tokenDetails.tokenInfo
          )
        )
          .then((response) => {
            var result = response.data;
            notification.messageType = result.IsSuccess
              ? "success"
              : "critical";
            notification.messageResultDetails[0].isSuccess = result.IsSuccess;
            if (result.IsSuccess === true) {
              this.modifyReadByWorkflow();
              this.getAccessCard(modTemporaryCard.PIN);
            } else {
              notification.messageResultDetails[0].errorMessage =
                result.ErrorList[0];
              console.log("Error in UpdatetemporaryCard:", result.ErrorList);
            }
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          })
          .catch((error) => {
            notification.messageResultDetails[0].errorMessage = error;
            toast(
              <ErrorBoundary>
                <NotifyEvent notificationMessage={notification}></NotifyEvent>
              </ErrorBoundary>,
              {
                autoClose:
                  notification.messageType === "success" ? 10000 : false,
              }
            );
          });
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on issueAccessCard",
        error
      );
    }
  };

  validateIssue() {
    const { modTemporaryCard } = this.state;
    var validationSectionErrors = lodash.cloneDeep(
      this.state.validationSectionErrors
    );
    Object.keys(accessIDSectionValidationDef).forEach(function (key) {
      if (key !== "CarrierCode") {
        validationSectionErrors[key] = Utilities.validateField(
          accessIDSectionValidationDef[key],
          modTemporaryCard[key]
        );
      }
    });
    this.setState({ validationSectionErrors });
    var returnValue = Object.values(validationSectionErrors).every(function (
      value
    ) {
      return value === "";
    });
    return returnValue;
  }

  activateAccessCard= () => {
    
    this.setState({ activateEnable: false });
      let showActivateAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

      this.setState({ showActivateAuthenticationLayout, }, () => {
        if (showActivateAuthenticationLayout === false) {
          this.handleActivateID();
        }
    });
     
  }

  handleActivateID = () => {
    this.handleAuthenticationClose();
    try {
      this.initializeTheButtonEnable();
      let modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
      
      var keyCode = [
        {
          key: KeyCodes.accessCardCode,
          value: modTemporaryCard.PIN,
        },
      ];
      var obj = {
        ShareholderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.accessCardCode,
        KeyCodes: keyCode,
      };
      let notification = {
        messageType: "critical",
        message: "AutoIDAssociation_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_x_Title"],
            keyValues: [modTemporaryCard.PIN],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestApis.ActivateAccessCardAutoID,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.modifyReadByWorkflow();
            this.getAccessCard(modTemporaryCard.PIN);
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in ActivatetemporaryCard:", result.ErrorList);
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        });
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on activateAccessCard",
        error
      );
    }
  };

  RevokeAccessCard= () => {
      
      let showRevokeAuthenticationLayout =
      this.props.userDetails.EntityResult.IsWebPortalUser !== true
        ? true
        : false;

      this.setState({ showRevokeAuthenticationLayout, }, () => {
        if (showRevokeAuthenticationLayout === false) {
          this.handleRevoleID();
        }
    });
    
    
  }

  handleRevoleID = () => {
    this.handleAuthenticationClose();
    try {
      this.initializeTheButtonEnable();
      let modTemporaryCard = lodash.cloneDeep(this.state.modTemporaryCard);
      // this.setState({ revokeEnable: false });
      var keyCode = [
        {
          key: KeyCodes.accessCardCode,
          value: modTemporaryCard.PIN,
        },
        {
          key: KeyCodes.entityCode,
          value: modTemporaryCard.EntityValue,
        },
        {
          key: KeyCodes.entityType,
          value: modTemporaryCard.EntityName,
        },
        {
          key: KeyCodes.carrierCode,
          value: modTemporaryCard.CarrierCode
        }
      ];
      var obj = {
        ShareholderCode: this.props.selectedShareholder,
        keyDataCode: KeyCodes.accessCardCode,
        KeyCodes: keyCode,
      };
      let notification = {
        messageType: "critical",
        message: "AutoIDAssociation_SavedStatus",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_x_Title"],
            keyValues: [modTemporaryCard.PIN],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestApis.RevokeAccessCardAutoID,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          var result = response.data;
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          if (result.IsSuccess === true) {
            this.modifyReadByWorkflow();
            this.getAccessCard(modTemporaryCard.PIN);
          } else {
            notification.messageResultDetails[0].errorMessage =
              result.ErrorList[0];
            console.log("Error in RevokeTemporaryCard:", result.ErrorList);
          }
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        })
        .catch((error) => {
          notification.messageResultDetails[0].errorMessage = error;
          toast(
            <ErrorBoundary>
              <NotifyEvent notificationMessage={notification}></NotifyEvent>
            </ErrorBoundary>,
            {
              autoClose: notification.messageType === "success" ? 10000 : false,
            }
          );
        });
    } catch (error) {
      console.log(
        "AccessIDManagementDetailsComposite:Error occured on activateAccessCard",
        error
      );
    }
  };

  handleAuthenticationClose = () => {
    this.setState({
      showAccessCardAuthenticationLayout: false,
      showIssueAuthenticationLayout: false,
      showRevokeAuthenticationLayout : false,
      showActivateAuthenticationLayout: false,
    });
  };

  getFunctionGroupName() {
    if(this.state.showAccessCardAuthenticationLayout)
      return fnAutoIDAssociation
    else if(this.state.showIssueAuthenticationLayout)
      return fnIssueCard
    else if(this.state.showRevokeAuthenticationLayout)
      return fnRevokeCard
    else if(this.state.showActivateAuthenticationLayout)
      return fnActivateCard

   };

  getAddorEditMode() {
    if (this.state.showAccessCardAuthenticationLayout)
      return this.state.temporaryCard.PIN === "" ? functionGroups.add : functionGroups.modify;
    else
      return functionGroups.modify;
   };


   handleOperation()  {
  
    if(this.state.showAccessCardAuthenticationLayout)
      return this.saveAccessCard
    else if(this.state.showIssueAuthenticationLayout)
      return this.handleIssueID
    else if(this.state.showRevokeAuthenticationLayout)
      return this.handleRevoleID
    else if(this.state.showActivateAuthenticationLayout)
      return this.handleActivateID
   
      
 };


  render() {
    const listOptions = {
      carrierCompanies: this.state.carrierCompanies,
      entityTypes: this.state.entityTypes,
      entityValues: this.state.entityValues,
    };
    let popUpContents = null;
    try {
      popUpContents = [
        {
          fieldName: "AccessCardList_LastUpdated",
          fieldValue:
            new Date(
              this.state.modTemporaryCard.LastUpdatedTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modTemporaryCard.LastUpdatedTime
            ).toLocaleTimeString(),
        },
        {
          fieldName: "AccessCardInfo_CreatedTime",
          fieldValue:
            new Date(
              this.state.modTemporaryCard.CreatedTime
            ).toLocaleDateString() +
            " " +
            new Date(
              this.state.modTemporaryCard.CreatedTime
            ).toLocaleTimeString(),
        },
        {
          fieldName: "TemporaryCard_CardSwipeTime",
          fieldValue:
            this.state.cardReadTime !== undefined &&
            this.state.cardReadTime !== null
              ? new Date(this.state.cardReadTime).toLocaleDateString() +
                " " +
                new Date(this.state.cardReadTime).toLocaleTimeString()
              : "",
        },
      ];
    } catch (error) {
      console.log(error);
    }

    let ShowCard =
      "TemporaryCard_ShowCard" + Constants.delimiter + this.state.location[0];

    function getLocalizedMessage(message) {
      try {
        let messageOptions = message.split(Constants.delimiter);
        return messageOptions[0];
      } catch (error) {
        console.log(error);
        return "";
      }
    }
    function getLocalizedMessageParameters(message) {
      try {
        let messageOptions = message.split(Constants.delimiter);
        messageOptions.splice(0, 1);
        return messageOptions;
      } catch (error) {
        console.log(error);
        return [];
      }
    }

    return (
      <div>
        <ErrorBoundary>
          <TranslationConsumer>
            {/* {(t) => (
              <div className="autoHeaderContainer">
                {this.state.isShow ? (
                  <h3>
                    {t(
                      getLocalizedMessage(ShowCard),
                      getLocalizedMessageParameters(ShowCard)
                    )}
                  </h3>
                ) : (
                  <h3>{t("TemporaryCard_SelectLocationForCard")}</h3>
                )}
              </div>
            )} */}
            {(t) => (
              <div className="autoHeaderContainer">
                {this.state.defaultShow ? (
                  <h3>{t("TemporaryCard_SelectLocationForCard")}</h3>
                ) : this.state.isShow ? (
                  <h3>
                    {t(
                      getLocalizedMessage(ShowCard),
                      getLocalizedMessageParameters(ShowCard)
                    )}
                  </h3>
                ) : (
                  ""
                )}
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
        <ErrorBoundary>
          <TMDetailsHeader newEntityName="TemporaryCard_LocationDetails"></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <AutoACLocationDetails
            handleSetLocation={this.props.onSetLocation}
            location={this.state.location}
          ></AutoACLocationDetails>
        </ErrorBoundary>

        <ErrorBoundary>
          <TMDetailsHeader
            entityCode={this.state.temporaryCard.PIN}
            newEntityName="AccessCardList_x_AccessCardDetails"
            popUpContents={popUpContents}
          ></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <AutoAccessIDAssociationDetails
            temporaryCard={this.state.temporaryCard}
            modTemporaryCard={this.state.modTemporaryCard}
            validationErrors={this.state.validationIDErrors}
            saveEnabled={this.state.saveEnabled}
            onFieldChange={this.handleIDChange}
            onDateTextChange={this.handleDateTextChange}
            handleShowCard={this.handleShowCard}
            handleSave={this.handleSave}
            handleReset={this.handleReset}
            location={this.state.location}
            TWICEnabled={this.state.TWICEnabled}
            isValidateFASCN={this.onFASCNBlur}
            isFASCNShow={this.state.isFASCNShow}
            modAttributeMetaDataList={this.state.modAttributeMetaDataList}
            attributeValidationErrors={this.state.attributeValidationErrors}
            onAttributeDataChange={this.handleAttributeDataChange} 
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
          ></AutoAccessIDAssociationDetails>
        </ErrorBoundary>

        <ErrorBoundary>
          <TMDetailsHeader newEntityName="AccessCardInfo_DetailsSection"></TMDetailsHeader>
        </ErrorBoundary>
        <ErrorBoundary>
          <AutoACDetailsSectionDetails
            temporaryCard={this.state.temporaryCard}
            modTemporaryCard={this.state.modTemporaryCard}
            validationErrors={this.state.validationSectionErrors}
            listOptions={listOptions}
            onFieldChange={this.handleSectionChange}
            handleIssueID={this.IssueAccessCard}
            handleRevoleID={this.RevokeAccessCard}
            handleActivateID={this.activateAccessCard}
            issueEnabled={this.state.issueEnabled}
            activateEnable={this.state.activateEnable}
            revokeEnable={this.state.revokeEnable}
          ></AutoACDetailsSectionDetails>
        </ErrorBoundary>
        {this.state.showAccessCardAuthenticationLayout||
          this.state.showIssueAuthenticationLayout ||
          this.state.showRevokeAuthenticationLayout ||
          this.state.showActivateAuthenticationLayout 
         ? (
          <UserAuthenticationLayout
            Username={this.props.userDetails.EntityResult.UserName}
            functionName={this.getAddorEditMode()}
            functionGroup={this.getFunctionGroupName()}
            handleOperation={this.handleOperation()}
            handleClose={this.handleAuthenticationClose}
          ></UserAuthenticationLayout>
        ) : null}
      </div>
    );
  }
}

let timer = undefined;

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(
  AutoAccessIDAssociationDetailsComposite
);

AutoAccessIDAssociationDetailsComposite.propTypes = {
  CardNumber: PropTypes.string.isRequired,
  location: PropTypes.array.isRequired,
  selectedShareholder: PropTypes.string.isRequired,
  onSetLocation: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  // notShowTitle: PropTypes.func.isRequired,
  // timerStop: PropTypes.func.isRequired,
};
