import axios from "axios";

import * as actionTypes from "./actionTypes";

export const newMessage = (message) => {
  return {
    type: actionTypes.NEW_MESSAGE,
    message: message,
  };
};

export const setMessageList = (messageList) => {
  return {
    type: actionTypes.SET_MESSAGE_LIST,
    messageList: messageList,
  };
};

const getUserChatListSuccess = (chatList) => {
  return {
    type: actionTypes.GET_CHAT_LIST_SUCCESS,
    chatList: chatList,
  };
};

export const getUserChatList = (token, username) => {
  return (dispatch) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .get(`http://127.0.0.1:8000/chats/?username=${username}`)
      .then((res) => dispatch(getUserChatListSuccess(res.data)));
  };
};
