import axios from "axios";

import * as actionTypes from "./actionTypes";

const getFriendListSuccess = (friendList) => {
  return {
    type: actionTypes.GET_FRIEND_LIST_SUCCESS,
    friendList: friendList,
  };
};

export const getFriendList = (accessToken, userId) => {
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
