import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  messageList: [],
  chatList: [],
};

const newMessage = (state, action) => {
  return updateObject(state, {
    messageList: [...state.messageList, action.message],
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
