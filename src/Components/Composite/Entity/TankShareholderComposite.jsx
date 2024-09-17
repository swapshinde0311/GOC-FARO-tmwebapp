import React, { Component } from "react";
import * as Utilities from "../../../JS/Utilities";
import axios from "axios";
import * as RestAPIs from "../../../JS/RestApis";
import { connect } from "react-redux";
import { Button } from "@scuf/common";
import ErrorBoundary from "../../ErrorBoundary";
import { TMUserActionsComposite } from "../Common/TMUserActionsComposite";
//import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";
import PropTypes from "prop-types";
import * as KeyCodes from "../../../JS/KeyCodes";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotifyEvent from "../../../JS/NotifyEvent";
import "../../../CSS/styles.css";
import "../../../CSS/tankShareholder.css"; // Customized CSS Imported
import { TMDetailsUserActions } from "../../UIBase/Common/TMDetailsUserActions";

class TankShareholderComposite extends Component {
  state = {
    TankShareholderList: [],
    totalTankCapacity: 0,
    totalGrossVolume: 0,
    totalNetVolume: 0,
    totalGrossMass: 0,
    BPColor:"",
    tankfill:{}
  };

  componentDidMount() {
    console.log("componentDidMount Called");
    try {
      Utilities.setArchive(this.props.userDetails.EntityResult.IsArchived);

      if (this.props.userDetails.EntityResult.IsDCHEnabled)
        this.getExternalSystemInfo();
      this.getTankShareholder();
      this.updateTankFill();
    } catch (error) {
      console.log(
        "TankShareholderComposite:Error occured on componentDidMount",
        error
      );
    }
  }

  //7Aug2024
  // handleChangeVolume = (e) => {
  //   this.setState({ totalGrossVolume: e.target.value });
  // };

  getTankShareholder() {
    try {
      axios(
        RestAPIs.ProjectGet + "?inputString=GetTankShareholder",
        Utilities.getAuthenticationObjectforGet(
          this.props.tokenDetails.tokenInfo
        )
      ).then((response) => {
        var result = response.data;
        console.log(`handleStartUnloading: ${JSON.stringify(result)}`);
        if (result.IsSuccess === true) {
          const tankShareholderList = result.EntityResult;
          const totalTankCapacity = tankShareholderList[0].TotalTankCapacity;
          const totalGrossVolume = tankShareholderList[0].TotalGrossVolume;
          const totalNetVolume = tankShareholderList[0].TotalNetVolume;
          const totalGrossMass = tankShareholderList[0].TotalGrossMass;
          const BPColor = tankShareholderList[0].BPColor;

          this.setState({
            TankShareholderList: tankShareholderList,
            totalTankCapacity: totalTankCapacity,
            totalGrossVolume: totalGrossVolume,
            totalNetVolume: totalNetVolume,
            totalGrossMass: totalGrossMass,
            BPColor: BPColor,
          });
        }
      });
    } catch (error) {
      console.log(
        "RailReceiptComposite:Error occured on handleStartUnloading",
        error
      );
    }
  }

  // handlePercentageChange = (index, event) => {
  //   const { value } = event.target;
  //   const updatedList = [...this.state.TankShareholderList];

  //   let newPercentage = parseFloat(value);

  //   if (value === "") {
  //     newPercentage = 0;
  //   }

  //   if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
  //     alert("Please enter a valid percentage between 0 and 100");
  //     return;
  //   }

  //   const totalEnteredPercentage = updatedList.reduce((acc, shareholder, idx) => {
  //     if (idx === index) {
  //       return acc + newPercentage;
  //     }
  //     return acc + shareholder.Percentage;
  //   }, 0);

  //   if (totalEnteredPercentage <= 100) {
  //     updatedList[index].Percentage = newPercentage;

  //     updatedList.forEach((shareholder, idx) => {
  //       shareholder.TotalCapacity = (shareholder.Percentage / 100) * this.state.totalTankCapacity;
  //     });

  //     this.setState({ TankShareholderList: updatedList });
  //   } else {
  //     alert("Total percentage exceeds 100%");
  //   }
  // };

  handlePercentageChange = (index, event) => {
    const { value } = event.target;
    const updatedList = [...this.state.TankShareholderList];

    let newPercentage = parseFloat(value);

    if (value === "") {
      newPercentage = 0;
    }

    if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
      alert("Please enter a valid percentage between 0 and 100");
      return;
    }

    const totalEnteredPercentage = updatedList.reduce(
      (acc, shareholder, idx) => {
        if (idx === index) {
          return acc + newPercentage;
        }
        return acc + shareholder.Percentage;
      },
      0
    );

    if (totalEnteredPercentage <= 100) {
      updatedList[index].Percentage = newPercentage;

      updatedList.forEach((shareholder, idx) => {
        // Calculate TotalCapacity based on TotalTankCapacity
        shareholder.TotalCapacity =
          (shareholder.Percentage / 100) * this.state.totalTankCapacity;

        // Calculate AvailableQty based on TotalGrossVolume,TotalNetVolume,TotalGrossMass
        shareholder.AvailableQty =
          (shareholder.Percentage / 100) * this.state.totalGrossVolume;
        shareholder.NetQty =
          (shareholder.Percentage / 100) * this.state.totalNetVolume;
        shareholder.KGAr =
          (shareholder.Percentage / 100) * this.state.totalGrossMass;
      });

      this.setState({ TankShareholderList: updatedList });
    } else {
      alert("Total percentage exceeds 100%");
    }
  };

  saveTankShareholder = (shareholder) => {
    return axios.post(RestAPIs.ProjectPost, {
      OperationName: "INSERTSHAREHOLDERSTOCKPERCENTAGE",
      ShareHolderCode: shareholder.Shareholder,
      Percentage: shareholder.Percentage,
      TotalCapacity: shareholder.TotalCapacity,
      AvailableQty: shareholder.AvailableQty,
      NetQty: shareholder.NetQty,
      KGAr: shareholder.KGAr,
    });
  };

  // handleSave = () => {
  //   const promises = this.state.TankShareholderList.map((shareholder) => {
  //     return this.saveTankShareholder(shareholder);
  //   });

  //   Promise.all(promises)
  //     .then((responses) => {
  //       responses.forEach((response, index) => {
  //         console.log(`TankShareholder saved successfully for ${this.state.TankShareholderList[index].Shareholder}`, response);
  //       });
  //     })
  //     .catch((error) => {
  //       console.log('Error while saving TankShareholder', error);
  //     });
  // };

  handleSaveTankSharholder() {
    try {
      const TankShareholder = { values: this.state.TankShareholderList };

      console.log(
        `handleSave in handleSaveTankSharholder() TankShareholder: ${JSON.stringify(
          TankShareholder
        )}`
      );
      console.log("handleSave in handleSaveTankSharholder:");
      let keyCode = [
        {
          key: KeyCodes.OperationName,
          value: "UPDATETANKSHAREHOLDER",
        },
      ];

      let obj = {
        keyDataCode: "",
        KeyCodes: keyCode,
        Input: this.state.TankShareholderList,
      };

      let notification = {
        messageType: "success",
        message: "TankShareholder Updated successfully",
        messageResultDetails: [
          {
            keyFields: [],
            keyValues: [],
            isSuccess: true,
            errorMessage: "",
          },
        ],
      };
      axios(
        RestAPIs.ProjectPost,
        Utilities.getAuthenticationObjectforPost(
          obj,
          this.props.tokenDetails.tokenInfo
        )
      )
        .then((response) => {
          let result = response.data;
          console.log(
            `handleSave in handleSaveTankSharholder() TankShareholder: ${JSON.stringify(
              result
            )}`
          );
          notification.messageType = result.IsSuccess ? "success" : "critical";
          notification.messageResultDetails[0].isSuccess = result.IsSuccess;
          notification.message = "TankShareholder Updated Successfully";
          console.log(
            `handleSave in handleSaveTankSharholder() TankShareholder: ${JSON.stringify(
              notification.message
            )}`
          );
          console.log(
            "ProjectPost api in TankSharholder response result =",
            result
          );
        })
        .catch((error) => {
          //alert('Error creating TankSharholder receipt:', error.message);
          notification.messageResultDetails[0].errorMessage =
            "Error creating TankShareholder ";
        });
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
        "handleSaveTankSharholder Error occured on handleSave",
        error
      );
    }
  }

  handleReset = () => {
    const updatedList = this.state.TankShareholderList.map((shareholder) => ({
      ...shareholder,
      Percentage: 0,
      TotalCapacity: 0,
    }));

    this.setState({ TankShareholderList: updatedList });
  };
  //New
  componentDidUpdate(prevProps, prevState) {
    // Update tankfill when relevant state changes
    if (
      prevState.totalTankCapacity !== this.state.totalTankCapacity ||
      prevState.totalGrossVolume !== this.state.totalGrossVolume ||
      prevState.BPColor !== this.state.BPColor
    ) {
      this.updateTankFill();
    }
  }
  updateTankFill() {

    const { totalTankCapacity, totalGrossVolume, BPColor } = this.state;
    const percentageFilled = (totalGrossVolume / totalTankCapacity) * 100;
    console.log("BPColor in updateTankFill",BPColor)
    
    const tankfill = {
      width: "100%",
      backgroundColor: `${BPColor}`,
      position: "absolute",
      bottom: "0",
      textAlign: "center",
      color: "#1b1c1d",
      height: `${percentageFilled}%`,
    };

    this.setState({ tankfill });
  }
  //END


  render() {
    const { totalTankCapacity, totalGrossVolume, tankfill } = this.state;
    const percentageFilled = (totalGrossVolume / totalTankCapacity) * 100;
    const remainingVolume = totalTankCapacity - totalGrossVolume;
    // var tankfill = {
    //   width: '100%',
    //   //backgroundColor: `'${this.state.BPColor}'`,
    //   backgroundColor: '#f47021',
    //   //backgroundColor: BPColor,
    //   position: 'absolute',
    //   bottom: '0',
    //   textAlign: 'center',
    //   color: '#fff',
    //   paddingleft: '20px',
    //   //height: `'${percentageFilled}%'`
    //   //height: '30%'
    // };
    //this.setState({tankfill});
    return (
      <div>
        <ErrorBoundary>
          <TMUserActionsComposite
            breadcrumbItem={this.props.activeItem}
            shareholders={this.props.userDetails.EntityResult.ShareholderList}
            handleBreadCrumbClick={this.props.handleBreadCrumbClick}
            shrVisible={false}
            addVisible={false}
            deleteVisible={false}
          ></TMUserActionsComposite>
        </ErrorBoundary>
        <div className="detailsContainer1">
          <div>
            <table className="tableTank">
              <thead>
                <tr>
                  <th>Shareholder</th>
                  <th>Percentage(%)</th>
                  {/* <th>Total Capacity</th> */}
                  <th>Available Quantity</th>
                  <th>Net Quantity</th>
                  {/* <th>KG/Ar</th> */}
                </tr>
              </thead>
              <tbody>
                {this.state.TankShareholderList.map((shareholder, index) => (
                  <tr key={index}>
                    <td>{shareholder.Code}</td>
                    <td>
                      <input
                        type="text"
                        value={shareholder.Percentage}
                        onChange={(event) =>
                          this.handlePercentageChange(index, event)
                        }
                        onBlur={() => this.saveTankShareholder(index)}
                      />
                    </td>
                    {/* <td>{shareholder.TotalCapacity}</td> */}
                    <td>{shareholder.AvailableQty}</td>
                    <td>{shareholder.NetQty}</td>
                    {/* <td>{shareholder.KGAr}</td> */}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td>100</td>
                  {/* <td>{this.state.totalTankCapacity}</td> */}
                  <td>{this.state.totalGrossVolume}</td>
                  <td>{this.state.totalNetVolume}</td>
                  {/* <td>{this.state.totalGrossMass}</td> */}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="row userActionPosition">
          <div className="col-12 col-md-12 col-lg-12">
            <div style={{ float: "right" }}>
              <Button
                content={"Reset"}
                className="cancelButton"
                onClick={this.handleReset}
              ></Button>
              <Button
                content={"Save"}
                onClick={() => this.handleSaveTankSharholder()}
              ></Button>
            </div>
          </div>
        </div>

        <div className="tank-container">
          <div>
            <div className="tank">
              <div
                // className="tank-fill"
                // style={{ height: `${percentageFilled}%` }}
                style={tankfill}
              >
                {`${percentageFilled.toFixed(2)}%`}
              </div>
            </div>
            <div className="tank-capacity">
              <p>Capacity: {totalTankCapacity} L</p>
            </div>
          </div>
          <div className="tank-info">
              <p className="tank-infoVolume">Remaining Volume: {remainingVolume} L</p>
              <p>Gross Volume: {totalGrossVolume} L</p>  
          </div>
          {/* <input
            type="range"
            min="0"
            max={totalTankCapacity}
            value={totalGrossVolume}
            onChange={this.handleChangeVolume}
          /> */}
        </div>

        <ErrorBoundary>
          <ToastContainer
            hideProgressBar={true}
            closeOnClick={false}
            closeButton={true}
            newestOnTop={true}
            position="bottom-right"
            toastClassName="toast-notification-wrap"
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
  };
};
export default connect(mapStateToProps)(TankShareholderComposite);

TankShareholderComposite.propTypes = {
  activeItem: PropTypes.object,
  userDetails: PropTypes.object.isRequired,
  tokenDetails: PropTypes.object.isRequired,
  handleBreadCrumbClick: PropTypes.func,
};
