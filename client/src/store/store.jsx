import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { thunk } from "redux-thunk";
import AuthReducer from "../reducers/authReducer";
import ProfileReducer from "../reducers/profileReducer";
import CartReducer from "../reducers/cartReducer";
import CurrReducer from "../reducers/currReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: AuthReducer,
  profile: ProfileReducer,
  cart: CartReducer,
  curr: CurrReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

window.store = store;

export default store;
