import * as types from "../Actions/ActionTypes";
import initialState from "./InitialState";

export default function userDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_USER_DETAILS_SUCCESS:
      return { ...state, userDetails: action.obj.data };
    case types.SET_TOKEN_INFO:
      return { ...state, TokenAuth: action.obj.data };

    default:
      return state;
  }
}
