import axios from "axios";

import * as actionTypes from "./actionTypes";

export const changeChatId = (chatId) => {
  return {
    type: actionTypes.CHANGE_CHAT_ID,
    chatId: chatId,
  };
};

export const newMessage = (data) => {
  return {
    type: actionTypes.NEW_MESSAGE,
    message: data.message,
    authorAvatarUrl: data.author_avatar_url,
  };
};

export const newChat = (chat) => {
  return {
    type: actionTypes.NEW_CHAT,
    chat: chat,
  };
};

export const setChatMessageListAndCompainonProfile = (data) => {
  return {
    type: actionTypes.SET_MESSAGE_LIST_AND_COMPANION_PROFILE,
    companionProfile: data["companion_profile"],
    messages: data["messages"],
  };
};

export const setMessageListChunk = (data) => {
  return {
    type: actionTypes.SET_MESSAGE_LIST_CHUNK,
    messages: data["messages"],
  };
};

export const setActiveChatId = (newActiveChatId) => {
  return {
    type: actionTypes.CHANGE_ACTIVE_CHAT_ID,
    newActiveChatId: newActiveChatId,
  };
};

const getUserChatListAndInfoSuccess = (data) => {
  return {
    type: actionTypes.GET_CHAT_LIST_AND_INFO_SUCCESS,
    chatList: data["chat_list"],
    userInfo: {
      avatarUrl: data["avatar_url"],
      profileDescription: data["profile_description"],
    },
  };
};

export const getUserChatListAndInfo = (token, userId) => {
  return (dispatch) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .get(`http://127.0.0.1:8000/profile/${userId}`)
      .then((res) => dispatch(getUserChatListAndInfoSuccess(res.data)));
  };
};

export const getChatData = (token, chatId, lastMessageIndex) => {
  return (dispatch) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .get(
        `http://127.0.0.1:8000/chats/${chatId}/?last_message_index=${lastMessageIndex}`
      )
      .then((res) => {
        if (res.data["companion_profile"]) {
          dispatch(setChatMessageListAndCompainonProfile(res.data));
        } else {
          dispatch(setMessageListChunk(res.data));
        }
      });
  };
};
