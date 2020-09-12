import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility";

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
      if (!newChatList[i]["last_message"]) {
        newChatList[i]["last_message"] = {};
      }

      newChatList[i]["last_message"].author = action.message.author;
      newChatList[i]["last_message"].content = action.message.content;
      newChatList[i]["last_message"].timestamp = action.message.timestamp;

      const newFirstChatList = newChatList.splice(i, 1);
      newChatList.unshift(newFirstChatList[0]);
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

const newChat = (state, action) => {
  return updateObject(state, {
    chatList: [action.chat, ...state.chatList],
  });
};

const setMessageList = (state, action) => {
  return updateObject(state, {
    messageList: action.messageList,
  });
};

const setChatList = (state, action) => {
  return updateObject(state, {
    chatList: action.chatList.map((chat) => ({ ...chat, active: false })),
  });
};

const setActiveChatId = (state, action) => {
  const newChatList = [...state.chatList];
  let setNewChat = false;
  let setOldChat = false;
  for (let i = 0; i < newChatList.length; i++) {
    if (newChatList[i]["active"]) {
      newChatList[i]["active"] = false;
      setOldChat = true;
    }
    if (newChatList[i]["id"] === action.newActiveChatId) {
      newChatList[i]["active"] = true;
      setNewChat = true;
    }
    if (setOldChat && setNewChat) {
      break;
    }
  }
  return updateObject(state, {
    chatList: newChatList,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CHAT_ID:
      return changeChatId(state, action);
    case actionTypes.NEW_MESSAGE:
      return newMessage(state, action);
    case actionTypes.NEW_CHAT:
      return newChat(state, action);
    case actionTypes.SET_MESSAGE_LIST:
      return setMessageList(state, action);
    case actionTypes.GET_CHAT_LIST_SUCCESS:
      return setChatList(state, action);
    case actionTypes.CHANGE_ACTIVE_CHAT_ID:
      return setActiveChatId(state, action);
    default:
      return state;
  }
};

export default reducer;
