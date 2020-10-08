import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  accessToken: null,
  refreshToken: null,
  username: null,
  userId: null,
  error: null,
  loading: false,
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    accessToken: action.accessToken,
    refreshToken: action.refreshToken,
    userId: parseInt(action.userId),
    username: action.username,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    accessToken: null,
    refreshToken: null,
    userId: null,
    username: null,
  });
};

const setAccessToken = (state, action) => {
  return updateObject(state, {
    accessToken: action.accessToken,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.SET_ACCESS_TOKEN:
      return setAccessToken(state, action);
    default:
      return state;
  }
};

export default reducer;
