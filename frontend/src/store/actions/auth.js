import axios from "axios";
import jwt_decode from "jwt-decode";

import * as actionTypes from "./actionTypes";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (username, userId, tokenList) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    accessToken: tokenList["access"],
    refreshToken: tokenList["refresh"],
    username: username,
    userId: userId,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  clearTimeout(localStorage.getItem("accessTimerId"));
  clearTimeout(localStorage.getItem("refreshTimerId"));

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("accessTokenExpirationDate");
  localStorage.removeItem("refreshTokenExpirationDate");
  localStorage.removeItem("accessTimerId");
  localStorage.removeItem("refreshTimerId");

  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const setAccessToken = (accessToken) => {
  return {
    type: actionTypes.SET_ACCESS_TOKEN,
    accessToken: accessToken,
  };
};

export const newAccessToken = (data) => {
  return (dispatch) => {
    localStorage.setItem("accessToken", data["access"]);

    const accessTokenExpirationDate = new Date(
      jwt_decode(data["access"])["exp"] * 1000
    );
    localStorage.setItem(
      "accessTokenExpirationDate",
      accessTokenExpirationDate
    );

    dispatch(setAccessToken(data["access"]));
    dispatch(
      checkAccessTokenTimeout(
        accessTokenExpirationDate.getTime() - new Date().getTime()
      )
    );
  };
};

export const checkRefreshTokenTimeout = (expirationTime) => {
  return (dispatch) => {
    const refreshTimerId = setTimeout(() => {
      dispatch(logout());
      console.log("time is over");
      // history.push("/");
    }, expirationTime);
    localStorage.setItem("accessTimerId", refreshTimerId);
  };
};

export const checkAccessTokenTimeout = (expirationTime) => {
  return (dispatch) => {
    const accessTimerId = setTimeout(() => {
      dispatch(getNewAccessToken());
    }, expirationTime);
    localStorage.setItem("accessTimerId", accessTimerId);
  };
};

export const getNewAccessToken = () => {
  return (dispatch) => {
    const refreshToken = localStorage.getItem("refreshToken");
    axios
      .post("http://127.0.0.1:8000/api-auth/login/refresh/", {
        refresh: refreshToken,
      })
      .then((response) => dispatch(newAccessToken(response.data)))
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

const onLoginResponse = (response, username) => {
  return (dispatch) => {
    const tokenList = response.data;
    const decodedAccessToken = jwt_decode(tokenList["access"]);
    const userId = decodedAccessToken["sub"];
    const accessTokenExpirationDate = new Date(
      decodedAccessToken["exp"] * 1000
    );
    const refreshTokenExpirationDate = new Date(
      jwt_decode(tokenList["refresh"])["exp"] * 1000
    );

    localStorage.setItem("accessToken", tokenList["access"]);
    localStorage.setItem("refreshToken", tokenList["refresh"]);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem(
      "accessTokenExpirationDate",
      accessTokenExpirationDate
    );
    localStorage.setItem(
      "refreshTokenExpirationDate",
      refreshTokenExpirationDate
    );

    dispatch(authSuccess(username, userId, tokenList));
    dispatch(
      checkAccessTokenTimeout(
        accessTokenExpirationDate.getTime() - new Date().getTime()
      )
    );
    dispatch(
      checkRefreshTokenTimeout(
        refreshTokenExpirationDate.getTime() - new Date().getTime()
      )
    );
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/api-auth/login/", {
        username: username,
        password: password,
      })
      .then((response) => dispatch(onLoginResponse(response, username)))
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authSignup = (username, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/api-auth/signup/", {
        username: username,
        password1: password1,
        password2: password2,
      })
      .then((response) => dispatch(onLoginResponse(response, username)))
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!Boolean(refreshToken)) {
      dispatch(logout());
    } else {
      const refreshTokenExpirationDate = new Date(
        localStorage.getItem("refreshTokenExpirationDate")
      );

      if (refreshTokenExpirationDate <= new Date()) {
        dispatch(logout());
        // history.push("/");
      } else {
        let accessTokenExpirationDate = new Date(
          localStorage.getItem("accessTokenExpirationDate")
        );
        if (accessTokenExpirationDate <= new Date()) {
          dispatch(getNewAccessToken());
        } else {
          dispatch(
            checkAccessTokenTimeout(
              accessTokenExpirationDate.getTime() - new Date().getTime()
            )
          );
        }

        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");
        const tokenList = {
          access: localStorage.getItem("accessToken"),
          refresh: refreshToken,
        };
        dispatch(authSuccess(username, userId, tokenList));

        dispatch(
          checkRefreshTokenTimeout(
            refreshTokenExpirationDate.getTime() - new Date().getTime()
          )
        );
      }
    }
  };
};
