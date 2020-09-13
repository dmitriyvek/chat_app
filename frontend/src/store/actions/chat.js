import axios from "axios";

import * as actionTypes from "./actionTypes";

export const changeChatId = (chatId) => {
  return {
    type: actionTypes.CHANGE_CHAT_ID,
    chatId: chatId,
  };
};

export const newMessage = (message) => {
  return {
    type: actionTypes.NEW_MESSAGE,
    message: message,
  };
};

export const newChat = (chat) => {
  return {
    type: actionTypes.NEW_CHAT,
    chat: chat,
  };
};

export const setMessageListAndCompanion = (data) => {
  return {
    type: actionTypes.SET_MESSAGE_LIST_AND_COMPANION,
    messageList: data["message_list"],
    participantList: data["participant_list"],
  };
};

export const setActiveChatId = (newActiveChatId) => {
  return {
    type: actionTypes.CHANGE_ACTIVE_CHAT_ID,
    newActiveChatId: newActiveChatId,
  };
};

const getUserChatListSuccess = (chatList) => {
  return {
    type: actionTypes.GET_CHAT_LIST_SUCCESS,
    chatList: chatList,
  };
};

export const getUserChatList = (token, userId) => {
  return (dispatch) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .get(`http://127.0.0.1:8000/chats/?user_id=${userId}`)
      .then((res) => dispatch(getUserChatListSuccess(res.data)));
  };
};

export const getChatMessageAndParticipantList = (token, chatId) => {
  return (dispatch) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .get(`http://127.0.0.1:8000/chats/${chatId}`)
      .then((res) => dispatch(setMessageListAndCompanion(res.data)));
  };
};
