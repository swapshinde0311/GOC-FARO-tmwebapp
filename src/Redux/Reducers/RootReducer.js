import { combineReducers } from "redux";
import userDetails from "./UserDetailsReducer";
import appTheme from "./AppThemeReducer";

const RootReducer = combineReducers({
  getUserDetails: userDetails,
  appTheme: appTheme
});

export default RootReducer;
