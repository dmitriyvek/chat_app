import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import WebSocketInstance from "../websocket";
import * as chatActions from "../store/actions/chat";
import { isSubList } from "../utility";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.onFriendClick = this.onFriendClick.bind(this);
  }

  startChat = (e) => {
    const chat = {
      userId: this.props.userId,
      recipientId: this.props.profileId,
    };
    WebSocketInstance.newChatCreation(chat);
    this.props.history.push(`/`);
    // this.props.history.push(`/${this.props.chatId}`);
    this.props.changeSidepanelContent();
    this.props.setActiveChatId(null);
    // this.props.setActiveChatId(this.props.chatId);
  };

  onFriendClick(e) {
    const chatList = this.props.chatList;
    for (let i = 0; i < chatList.length; i++) {
      if (
        isSubList(chatList[i]["participant_list"], [
          this.props.userId,
          this.props.profileId,
        ])
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
    chatId: state.chat.chatId,
    chatList: state.chat.chatList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChatId: (newActiveChatId) =>
      dispatch(chatActions.setActiveChatId(newActiveChatId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Profile));
