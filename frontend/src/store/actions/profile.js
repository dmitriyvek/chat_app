import axios from "axios";

import * as actionTypes from "./actionTypes";

const getFriendListSuccess = (friendList) => {
  return {
    type: actionTypes.GET_FRIEND_LIST_SUCCESS,
    friendList: friendList,
  };
};

export const getFriendList = (token, userId) => {
  return (dispatch) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .get(`http://127.0.0.1:8000/friends/?user_id=${userId}`)
      .then((res) => dispatch(getFriendListSuccess(res.data)));
  };
};
