import React from "react";
import { connect } from "react-redux";

import * as chatActions from "../store/actions/chat";
import * as profileActions from "../store/actions/profile";
import Profile from "../components/Profile";
import Contact from "../components/Contact";
import CurrentUserProfile from "../components/CurrentUserProfile";
import WebSocketInstance from "../websocket";

class Sidepanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "chatList",
    };
    this.changeSidepanelContent = this.changeSidepanelContent.bind(this);
    this.initialiseWebSocket();
  }

  initialiseWebSocket() {
    if (Object.keys(WebSocketInstance.callbackList).length === 0) {
      WebSocketInstance.addCallbackList(
        this.props.newMessage,
        this.props.newChat
      );
    }
    WebSocketInstance.connect(this.props.accessToken);
  }

  componentDidMount() {
    if (this.props.accessToken !== null && this.props.userId !== null) {
      this.props.getUserChatListAndInfo(
        this.props.accessToken,
        this.props.userId
      );
    }
  }

  changeSidepanelContent(e) {
    if (this.state.display === "chatList") {
      this.setState({ display: "friendList" });
      if (!this.props.friendList.length) {
        this.props.getFriendList(this.props.accessToken, this.props.userId);
      }
    }
    if (this.state.display === "friendList") {
      this.setState({ display: "chatList" });
    }
  }

  getActiveChatList() {
    const chatList = this.props.chatList.map((chat) => {
      console.log(chat);
      return (
        <Contact
          key={chat.id}
          chatId={chat.id}
          style={{
            background: chat["active"] ? "#d3e7fb" : null,
            fontStyle: chat["last_message"]["is_service"] ? "italic" : "normal",
          }}
          name={chat["last_message"]["author"]["username"]}
          avatarUrl={chat["last_message"]["author"]["avatar_url"]}
          lastMessage={chat["last_message"]["content"]}
          lastMessageTime={chat["last_message"]["timestamp"]}
        />
      );
    });
    return chatList;
  }

  getFriendList() {
    const friendList = this.props.friendList.map((profile) => {
      console.log(profile);
      return (
        <Profile
          key={profile.id}
          profileId={profile.id}
          name={profile["username"]}
          avatarUrl="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
          description={profile["profile_description"]}
          changeSidepanelContent={this.changeSidepanelContent}
        />
      );
    });
    return friendList;
  }

  render() {
    return (
      <div className="column-left">
        <CurrentUserProfile />

        <div className="contact-search-box">
          <div className="contact-search-box__wrapper">
            <i className="material-icons">search</i>
            <input
              className="contact-search-input"
              placeholder="Search here"
              type="text"
            />
          </div>
        </div>

        <button onClick={this.changeSidepanelContent}>
          {this.state.display === "chatList"
            ? "show friend list"
            : "show chat list"}
        </button>

        <div className="contact-list slide-box slide-box_contact-list">
          {this.state.display === "chatList"
            ? this.getActiveChatList()
            : this.getFriendList()}
        </div>

        <div className="application-settings-tray"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    accessToken: state.auth.accessToken,
    userId: state.auth.userId,
    chatList: state.chat.chatList,
    friendList: state.profile.friendList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserChatListAndInfo: (username, accessToken) =>
      dispatch(chatActions.getUserChatListAndInfo(username, accessToken)),
    getFriendList: (accessToken, userId) =>
      dispatch(profileActions.getFriendList(accessToken, userId)),
    newMessage: (message) => dispatch(chatActions.newMessage(message)),
    newChat: (chat) => dispatch(chatActions.newChat(chat)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidepanel);
