import axios from "axios";

import * as actionTypes from "./actionTypes";

const getFriendListSuccess = (friendList) => {
  return {
    type: actionTypes.GET_FRIEND_LIST_SUCCESS,
    friendList: friendList,
  };
};

export const getFriendList = (accessToken) => {
  return (dispatch) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    axios
      .get(`http://127.0.0.1:8000/friends/`)
      .then((response) => dispatch(getFriendListSuccess(response.data)));
  };
};

const getUserListSuccess = (userList) => {
  return {
    type: actionTypes.GET_USER_LIST_SUCCESS,
    userList: userList,
  };
};

export const getUserList = (accessToken) => {
  return (dispatch) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    axios
      .get(`http://127.0.0.1:8000/users/`)
      .then((response) => dispatch(getUserListSuccess(response.data)));
  };
};

export const newFriend = (friendProfile) => {
  return {
    type: actionTypes.NEW_FRIEND,
    friendProfile: friendProfile,
  };
};