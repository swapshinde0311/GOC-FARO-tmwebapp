import * as types from "./ActionTypes";

export function setTokenInfoSuccess(obj) {
  return { type: types.SET_TOKEN_INFO, obj };
}

export function setTokenInfo(data) {
  return async function (dispatch) {
    return dispatch(setTokenInfoSuccess({ data: data }));
  };
}
