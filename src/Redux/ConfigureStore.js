import { createStore, applyMiddleware } from "redux";
import RootReducer from "./Reducers/RootReducer";
import thunk from "redux-thunk";
//import reduxImmutableStateInvariant from "redux-immutable-state-invariant";

export default function configureStore(initialState) {
  // const composeEnhancer =
  //   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(RootReducer, initialState, applyMiddleware(thunk));
}
