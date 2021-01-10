import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  friendList: [],
  userList: [],
};

const setFriendList = (state, action) => {
  return updateObject(state, {
    friendList: action.friendList,
  });
};

const setUserList = (state, action) => {
  return updateObject(state, {
    userList: action.userList,
  });
};

const addNewFriend = (state, action) => {
  return updateObject(state, {
    friendList: [...state.friendList, action.friendProfile]
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_FRIEND_LIST_SUCCESS:
      return setFriendList(state, action);
    case actionTypes.GET_USER_LIST_SUCCESS:
      return setUserList(state, action);
    case actionTypes.NEW_FRIEND:
      return addNewFriend(state, action);
    default:
      return state;
  }
};

export default reducer;
