import React from "react";
import ReactDOM from "react-dom";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import App from "./App";
import authReducer from "./store/reducers/auth";
import chatReducer from "./store/reducers/chat";
import profileReducer from "./store/reducers/profile";

import "./assets/scss/style.scss";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
  const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    profile: profileReducer,
  });

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );

  //   if (module.hot) {
  //     module.hot.accept("./store/reducers", () => {
  //       const nextRootReducer = require("./store/reducers/auth");
  //       store.replaceReducer(nextRootReducer);
  //     });
  //   }

  return store;
};

const store = configureStore();

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("app"));
