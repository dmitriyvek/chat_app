import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  chatId: 0,
  chatList: [],
  messageList: [],
};

const changeChatId = (state, action) => {
  return updateObject(state, {
    chatId: parseInt(action.chatId),
  });
};

const newMessage = (state, action) => {
  // let updatedChat;
  const newChatList = [...state.chatList];
  for (let i = 0; i < newChatList.length; i++) {
    if (newChatList[i].id === action.message["chat_id"]) {
      newChatList[i]["last_message"].author = action.message.author;
      newChatList[i]["last_message"].content = action.message.content;
      newChatList[i]["last_message"].timestamp = action.message.timestamp;
      break;
    }
  }
  // updatedChat["last_message"] = {
  //   ...updatedChat["last_message"],
  //   author: action.message.author,
  //   content: action.message.content,
  //   timestamp: action.message.timestamp,
  // };
  const newMessageList =
    state.chatId === action.message["chat_id"]
      ? [...state.messageList, action.message]
      : state.messageList;
  return updateObject(state, {
    messageList: newMessageList,
    chatList: newChatList,
  });
};

const setMessageList = (state, action) => {
  return updateObject(state, {
    messageList: action.messageList,
  });
};

const setChatList = (state, action) => {
  return updateObject(state, {
    chatList: action.chatList,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CHAT_ID:
      return changeChatId(state, action);
    case actionTypes.NEW_MESSAGE:
      return newMessage(state, action);
    case actionTypes.SET_MESSAGE_LIST:
      return setMessageList(state, action);
    case actionTypes.GET_CHAT_LIST_SUCCESS:
      return setChatList(state, action);
    default:
      return state;
  }
};

export default reducer;
