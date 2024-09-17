import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { LanguagesDetails } from "../../UIBase/Details/LanguagesDetails";
import { TranslationConsumer } from "@scuf/localization";
import { Button } from "@scuf/common";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap-grid.css";
import ErrorBoundary from "../../ErrorBoundary";
import PropTypes from "prop-types";
import { LoadingPage } from "../../UIBase/Common/LoadingPage";
import lodash from "lodash";
import * as KeyCodes from "../../../JS/KeyCodes";
import { toast } from "react-toastify";
import NotifyEvent from "../../../JS/NotifyEvent";
import * as Constants from "../../../JS/Constants";
import { functionGroups, fnLanguage } from "../../../JS/FunctionGroups";

class LanguagesDetailComposite extends Component {
  state = {
    isReadyToRender: true,
    saveEnabled: false,
    availablelanguageOptions: [],
    languageSearchOptions: [],
    selectedLanguageOptions: [],
    languagesAddSelectionRows: [],
    languagesDeleteSelectionRows: [],
  };

  componentDidMount() {
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);
      this.getLanguages();
    } catch (error) {
      console.log(
        "LanguagesDetailComposite:Error occured on componentDidMount",
        error
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    try {
    } catch (error) {
      console.log(
        "LanguagesDetailComposite:Error occured on componentWillReceiveProps",
        error
      );
    }
  }
  handleAddAssociation = () => {
    try {
      let newComp = {
        LanguageCode: "",
        LanguageName: "",
      };
      let selectedLanguageOptions = lodash.cloneDeep(
        this.state.selectedLanguageOptions
      );
      selectedLanguageOptions.push(newComp);
      selectedLanguageOptions.sort((a, b) => {
        if (a.LanguageName > b.LanguageName) {
          return 1;
        } else if (a.LanguageName < b.LanguageName) {
          return -1;
        } else {
          return 0;
        }
      });
      this.setState({
        selectedLanguageOptions,
      });
    } catch (error) {
      console.log(
        "LanguagesDetailComposite:Error occured on handleAddAssociation",
        error
      );
    }
  };
  handleDeleteAssociation = () => {
    if (!this.props.userDetails.EntityResult.IsArchived) {
      try {
        if (
          this.state.selectedCompRow != null &&
          this.state.selectedCompRow.length > 0
        ) {
          if (this.state.modAssociations.length > 0) {
            let modAssociations = lodash.cloneDeep(this.state.modAssociations);

            this.state.selectedCompRow.forEach((obj, index) => {
              modAssociations = modAssociations.filter((com, cindex) => {
                return com.SequenceNo !== obj.SequenceNo;
              });
            });

            for (let i = 0; i < modAssociations.length; i++) {
              modAssociations[i].SequenceNo = i + 1;
            }

            this.setState({ modAssociations });
          }
        }

        this.setState({ selectedCompRow: [] });
      } catch (error) {
        console.log(
          "LanguagesDetailComposite:Error occured on handleDeleteAssociation",
          error
        );
      }
    }
  };

  getLanguages() {
    this.setState({
      saveEnabled: Utilities.isInFunction(
        this.props.userDetails.EntityResult.FunctionsList,
        functionGroups.modify,
        fnLanguage
      ),
    });

    axios(
      RestAPIs.GetLanguages,
      Utilities.getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var result = response.data;
        if (result.IsSuccess === true) {
          var availablelanguageOptions = lodash.cloneDeep(
            this.state.availablelanguageOptions
          );
          var selectedLanguageOptions = lodash.cloneDeep(
            this.state.selectedLanguageOptions
          );
          if (result.EntityResult !== null) {
            if (
              result.EntityResult.AvailableLanguage !== null ||
              result.EntityResult.AvailableLanguage !== undefined
            ) {
              result.EntityResult.AvailableLanguage.forEach((avaLanguages) => {
                availablelanguageOptions.push({
                  value: avaLanguages.Code + ":" + avaLanguages.Name,
                  text: avaLanguages.Name,
                });
              });
              availablelanguageOptions.sort((a, b) => {
                if (a.value > b.value) {
                  return 1;
                } else if (a.value < b.value) {
                  return -1;
                } else {
                  return 0;
                }
              });
              let languageSearchOptions = lodash.cloneDeep(
                availablelanguageOptions
              );
              if (
                languageSearchOptions.length > Constants.filteredOptionsCount
              ) {
                languageSearchOptions = languageSearchOptions.slice(
                  0,
                  Constants.filteredOptionsCount
                );
              }
              this.setState({
                availablelanguageOptions,
                isReadyisToRender: true,
                languageSearchOptions: languageSearchOptions,
              });
            }
            if (
              result.EntityResult.Language !== null ||
              result.EntityResult.Language !== undefined
            ) {
              result.EntityResult.Language.forEach((avaLanguages) => {
                selectedLanguageOptions.push({
                  LanguageCode: avaLanguages.Code,
                  LanguageName: avaLanguages.Name,
                });
              });
              selectedLanguageOptions.sort((a, b) => {
                if (a.LanguageName > b.LanguageName) {
                  return 1;
                } else if (a.LanguageName < b.LanguageName) {
                  return -1;
                } else {
                  return 0;
                }
              });
              this.setState({
                selectedLanguageOptions,
                isReadyisToRender: true,
              });
            }
          } else {
            this.setState({
              availablelanguageOptions: lodash.cloneDeep(
                this.state.availablelanguageOptions
              ),
              selectedLanguageOptions: lodash.cloneDeep(
                this.state.selectedLanguageOptions
              ),
            });
          }
        } else {
          console.log(
            "LanguagesDetailComposite:Error in getLanguages:",
            result.ErrorList
          );
        }
      })
      .catch((error) => {
        console.log(
          "LanguagesDetailComposite:Error while getting Languages:",
          error
        );
      });
  }

  handleAddRowSelectionChange = (languagesRow, cellData) => {
    let selectedLanguageOptions = lodash.cloneDeep(
      this.state.selectedLanguageOptions
    );
    let languagesAddSelectionRows = lodash.cloneDeep(
      this.state.languagesAddSelectionRows
    );
    let availablelanguageOptions = lodash.cloneDeep(
      this.state.availablelanguageOptions
    );
    var SelectedInfo = languagesRow.split(":");
    languagesAddSelectionRows.push({
      LanguageCode: SelectedInfo[0],
      LanguageName: SelectedInfo[1],
    });
    selectedLanguageOptions[cellData.rowIndex][cellData.field] =
      SelectedInfo[1];
    selectedLanguageOptions[cellData.rowIndex]["LanguageCode"] =
      SelectedInfo[0];
    selectedLanguageOptions.sort((a, b) => {
      if (a.LanguageName > b.LanguageName) {
        return 1;
      } else if (a.LanguageName < b.LanguageName) {
        return -1;
      } else {
        return 0;
      }
    });
    let addRowIndex = availablelanguageOptions.findIndex(
      (item) => item.LanguageName === languagesAddSelectionRows[0].LanguageName
    );
    availablelanguageOptions.splice(addRowIndex, 1);
    availablelanguageOptions.sort((a, b) => {
      if (a.LanguageName > b.LanguageName) {
        return 1;
      } else if (a.LanguageName < b.LanguageName) {
        return -1;
      } else {
        return 0;
      }
    });
    this.setState({
      languagesAddSelectionRows: [],
      selectedLanguageOptions,
      availablelanguageOptions,
      isReadyToRender: true,
    });
  };
  handleDeleteRowSelectionChange = (languagesRow) => {
    this.setState({ languagesDeleteSelectionRows: languagesRow });
  };

  addLanguages = () => {
    try {
      var languagesAddSelectionRows = lodash.cloneDeep(
        this.state.languagesAddSelectionRows
      );
      var selectedLanguageOptions = this.state.selectedLanguageOptions;
      var availablelanguageOptions = this.state.availablelanguageOptions;

      if (
        languagesAddSelectionRows !== null &&
        languagesAddSelectionRows.length > 0
      ) {
        selectedLanguageOptions.push(languagesAddSelectionRows[0]);

        selectedLanguageOptions.sort((a, b) => {
          if (a.LanguageName > b.LanguageName) {
            return 1;
          } else if (a.LanguageName < b.LanguageName) {
            return -1;
          } else {
            return 0;
          }
        });
        let addRowIndex = availablelanguageOptions.findIndex(
          (item) =>
            item.LanguageName === languagesAddSelectionRows[0].LanguageName
        );
        availablelanguageOptions.splice(addRowIndex, 1);
        availablelanguageOptions.sort((a, b) => {
          if (a.LanguageName > b.LanguageName) {
            return 1;
          } else if (a.LanguageName < b.LanguageName) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      this.setState({
        selectedLanguageOptions,
        availablelanguageOptions,
        isReadyisToRender: true,
        languagesAddSelectionRows: [],
      });
    } catch (error) {
      console.log(
        "LanguagesDetailComposite:Error occured on addLanguages",
        error
      );
    }
  };

  deleteLanguages = () => {
    try {
      var languagesDeleteSelectionRows = lodash.cloneDeep(
        this.state.languagesDeleteSelectionRows
      );

      var selectedLanguageOptions = this.state.selectedLanguageOptions;
      var availablelanguageOptions = this.state.availablelanguageOptions;
      let notification = {
        messageType: "critical",
        message: "Language_DeleteNotAllowed",
        messageResultDetails: [
          {
            keyFields: ["AccessCardInfo_Delete"],
            keyValues: ["Not Allowed"],
            isSuccess: false,
            errorMessage: "",
          },
        ],
      };
      if (
        languagesDeleteSelectionRows !== null &&
        languagesDeleteSelectionRows.length > 0
      ) {
        if (languagesDeleteSelectionRows[0].LanguageName !== "English-US") {
          availablelanguageOptions.push(languagesDeleteSelectionRows[0]);

          availablelanguageOptions.sort((a, b) => {
            if (a.LanguageName > b.LanguageName) {
              return 1;
            } else if (a.LanguageName < b.LanguageName) {
              return -1;
            } else {
              return 0;
            }
          });

          let deleteRowIndex = selectedLanguageOptions.findIndex(
            (item) =>
              item.LanguageName === languagesDeleteSelectionRows[0].LanguageName
          );
          selectedLanguageOptions.splice(deleteRowIndex, 1);
          selectedLanguageOptions.sort((a, b) => {
            if (a.LanguageName > b.LanguageName) {
              return 1;
            } else if (a.LanguageName < b.LanguageName) {
              return -1;
            } else {
              return 0;
            }
          });
        } else {
          this.handleNotify(notification);
        }
      }
      this.setState({
        selectedLanguageOptions: selectedLanguageOptions.sort(),
        availablelanguageOptions: availablelanguageOptions.sort(),
        isReadyisToRender: true,
        languagesDeleteSelectionRows: [],
      });
    } catch (error) {
      console.log(
        "LanguagesDetailComposite:Error occured on deleteLanguages",
        error
      );
    }
  };
  handleNotify(notification) {
    try {
      toast(
        <ErrorBoundary>
          <NotifyEvent notificationMessage={notification}></NotifyEvent>
        </ErrorBoundary>,
        {
          autoClose: notification.messageType === "success" ? 10000 : false,
        }
      );
    } catch (error) {
      console.log(
        "LanguagesDetailComposite: Error occurred on handleNotify",
        error
      );
    }
  }

  handleLanguagesSearchChange = (languagecode) => {
    try {
      let languageSearchOptions = this.state.availablelanguageOptions.filter(
        (item) => item.value.toLowerCase().includes(languagecode.toLowerCase())
      );
      if (languageSearchOptions.length > Constants.filteredOptionsCount) {
        languageSearchOptions = languageSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        languageSearchOptions,
      });
    } catch (error) {
      console.log(
        "LanguagesDetailComposite:Error occured on handleLanguagesSearchChange",
        error
      );
    }
  };

  handleFoucsLanguagesChange = () => {
    try {
      let languageSearchOptions = this.state.availablelanguageOptions;
      if (languageSearchOptions.length > Constants.filteredOptionsCount) {
        languageSearchOptions = languageSearchOptions.slice(
          0,
          Constants.filteredOptionsCount
        );
      }

      this.setState({
        languageSearchOptions,
      });
    } catch (error) {
      console.log(
        "LanguagesDetailComposite:Error occured on handleLanguagesSearchChange",
        error
      );
    }
  };

  getLanguageSearchOptions() {
    let languageSearchOptions = lodash.cloneDeep(
      this.state.languageSearchOptions
    );
    let modLanguageCode = this.state.CarrierCode;
    if (
      modLanguageCode !== null &&
      modLanguageCode !== "" &&
      modLanguageCode !== undefined
    ) {
      let selectedLanguageCode = languageSearchOptions.find(
        (element) =>
          element.value.toLowerCase() === modLanguageCode.toLowerCase()
      );
      if (selectedLanguageCode === undefined) {
        languageSearchOptions.push({
          text: modLanguageCode,
          value: modLanguageCode,
        });
      }
    }
    return languageSearchOptions;
  }

  saveLanguageSelect = () => {
    var selectedLanguageOptions = lodash.cloneDeep(
      this.state.selectedLanguageOptions
    );
    let keyCode = [
      {
        key: KeyCodes.shareholderCode,
        value: this.props.selectedShareholder,
      },
    ];
    let obj = {
      keyDataCode: KeyCodes.shareholderCode,
      KeyCodes: keyCode,
      Entity: selectedLanguageOptions,
    };
    let notification = {
      messageType: "critical",
      message: "LanguageInfo_SavedStatus",
      messageResultDetails: [
        {
          keyFields: ["Languages_PageTitle"],
          keyValues: ["Save"],
          isSuccess: false,
          errorMessage: "",
        },
      ],
    };
    axios(
      RestAPIs.UpdateLanguages,
      Utilities.getAuthenticationObjectforPost(
        obj,
        this.props.tokenDetails.tokenInfo
      )
    )
      .then((response) => {
        let result = response.data;
        notification.messageType = result.IsSuccess ? "success" : "critical";
        notification.messageResultDetails[0].isSuccess = result.IsSuccess;
        if (result.IsSuccess === true) {
          if (!result.resultAdd || !result.resultDelete) {
            notification.errorMessage = "Languages Updated Failed";
            if (!result.resultAdd)
              notification.errorMessage += response.errorMessage;
            if (!result.resultAdd)
              notification.errorMessage += response.errorMessage;
            if (!result.resultAdd && !result.resultDelete)
              notification.errorMessage += response.errorMessage;
          }
          notification.errorMessage = "";

          this.setState({});
        } else {
          notification.messageResultDetails[0].errorMessage =
            result.ErrorList[0];
          this.setState({});
          console.log("Error in createTankGroup:", result.ErrorList);
        }
        this.handleNotify(notification);
      })
      .catch((error) => {
        this.setState({});
        notification.messageResultDetails[0].errorMessage = error;
      });
  };

  render() {
    return this.state.isReadyisToRender ? (
      <div>
        <ErrorBoundary>
          <LanguagesDetails
            availablelanguageOptions={this.getLanguageSearchOptions()}
            selectedLanguageOptions={this.state.selectedLanguageOptions}
            isEnterpriseNode={
              this.props.userDetails.EntityResult.IsEnterpriseNode
            }
            // listOptions={{
            //   availablelanguageOptions: this.state.languageSearchOptions,
            //   selectedLanguageOptions: this.state.selectedLanguageOptions,
            // }}
            languagesAddSelectionRows={this.state.languagesAddSelectionRows}
            languagesDeleteSelectionRows={
              this.state.languagesDeleteSelectionRows
            }
            handleAddRowSelectionChange={this.handleAddRowSelectionChange}
            handleDeleteRowSelectionChange={this.handleDeleteRowSelectionChange}
            handleFoucsLanguagesChange={this.handleFoucsLanguagesChange}
            addLanguages={this.addLanguages}
            deleteLanguages={this.deleteLanguages}
            handleAddAssociation={this.handleAddAssociation}
            onLanguagesSearchChange={this.handleLanguagesSearchChange}
          ></LanguagesDetails>
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationConsumer>
            {(t) => (
              <div className="row">
                <div className="col-12 col-md-6 col-lg-2"></div>
                <div
                  className="col-12 col-md-6 col-lg-8"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    className="saveButton"
                    disabled={!this.state.saveEnabled}
                    onClick={() => this.saveLanguageSelect()}
                    content={t("Language_Save")}
                  ></Button>
                </div>
                <div className="col-12 col-md-6 col-lg-2"></div>
              </div>
            )}
          </TranslationConsumer>
        </ErrorBoundary>
      </div>
    ) : (
      <LoadingPage message="Loading"></LoadingPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};

export default connect(mapStateToProps)(LanguagesDetailComposite);

LanguagesDetailComposite.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  terminalCodes: PropTypes.array.isRequired,
};
