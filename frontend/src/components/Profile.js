import axios from "axios";
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import * as chatActions from "../store/actions/chat";
import { isSubList } from "../utility";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.onFriendClick = this.onFriendClick.bind(this);
  }

  startChat = (e) => {
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${this.props.token}`,
    };
    axios
      .post(`http://127.0.0.1:8000/chats/create/`, {
        participant_list: [this.props.userId, this.props.profileId],
      })
      .then((res) => {
        this.props.newChat(res.data);
        this.props.history.push(`/${res.data.id}`);
        this.props.changeSidepanelContent();
        this.props.setActiveChatId(res.data.id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  onFriendClick(e) {
    const chatList = this.props.chatList;
    for (let i = 0; i < chatList.length; i++) {
      if (
        // isSubList(chatList[i]["participant_list"], [
        //   this.props.userId,
        //   this.props.profileId,
        // ])
        false
      ) {
        this.props.history.push(`/${chatList[i]["id"]}`);
        this.props.changeSidepanelContent();
        this.props.setActiveChatId(chatList[i]["id"]);
        return;
      }
    }
    this.startChat(e);
  }

  render() {
    return (
      <div onClick={this.onFriendClick}>
        <div className="contact-box">
          <img className="profile-image" src={this.props.avatarUrl} alt="" />
          <div className="contact-box__text-wrapper">
            <h6 className="contact-box__profile_name">{this.props.name}</h6>
            <p className="contact-box__last-message-text">
              {this.props.description}
            </p>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    token: state.auth.token,
    chatList: state.chat.chatList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserChatList: (username, token) =>
      dispatch(chatActions.getUserChatList(username, token)),
    setActiveChatId: (newActiveChatId) =>
      dispatch(chatActions.setActiveChatId(newActiveChatId)),
    newChat: (chat) => dispatch(chatActions.newChat(chat)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Profile));
