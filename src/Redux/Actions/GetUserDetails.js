import * as types from "./ActionTypes";
// import axios from "axios";
// import * as Constants from "../../JS/Constants";
// import { getAuthenticationObjectforGet } from "../../JS/Utilities";

export function getUserDetailsSucess(obj) {
  return { type: types.GET_USER_DETAILS_SUCCESS, obj };
}

export function getUserDetails(data) {
  return function (dispatch) {
    return dispatch(getUserDetailsSucess({ data: data }));
    // return (
    //   axios(Constants.Getloggedinuserdetails, getAuthenticationObjectforGet())
    //     //.then((data) => data.json)
    //     .then((response) => {
    //       dispatch(getUserDetailsSucess({ data: response.data }));
    //     })
    // );
  };
}
