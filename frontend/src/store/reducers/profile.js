import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  friendList: [],
};

const setFriendList = (state, action) => {
  return updateObject(state, {
    friendList: action.friendList,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_FRIEND_LIST_SUCCESS:
      return setFriendList(state, action);
    default:
      return state;
  }
};

export default reducer;
