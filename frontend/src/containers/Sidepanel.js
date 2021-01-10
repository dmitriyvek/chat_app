import React from "react";
import { connect } from "react-redux";

import * as chatActions from "../store/actions/chat";
import * as profileActions from "../store/actions/profile";
import FriendProfile from "../components/FriendProfile";
import Contact from "../components/Contact";
import CurrentUserProfile from "../components/CurrentUserProfile";
import UserProfile from "../components/UserProfile";

class Sidepanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "chatList",
    };
    this.displayChatList = this.displayChatList.bind(this);
    this.displayFriendList = this.displayFriendList.bind(this);
    this.displayUserList = this.displayUserList.bind(this);
  }

  componentDidMount() {
    if (this.props.accessToken !== null && this.props.userId !== null) {
      this.props.getUserChatListAndInfo(
        this.props.accessToken,
        this.props.userId
      );
    }
  }

  displayChatList(e) {
    this.setState({ display: "chatList" });
  }

  displayFriendList(e) {
    this.setState({ display: "friendList" });
    if (!this.props.friendList.length) {
      this.props.getFriendList(this.props.accessToken);
    }
  }

  displayUserList(e) {
    this.setState({ display: "userList" });
    if (!this.props.userList.length) {
      this.props.getUserList(this.props.accessToken);
    }
  }

  getActiveChatList() {
    const chatList = this.props.chatList.map((chat) => {
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
      return (
        <FriendProfile
          key={profile.id}
          profileId={profile.id}
          name={profile["username"]}
          avatarUrl="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
          description={profile["profile_description"]}
          changeSidepanelContent={this.displayChatList}
        />
      );
    });
    return friendList;
  }

  getUserList() {
    const userList = this.props.userList.map((profile) => {
      return (
        <UserProfile
          key={profile.id}
          profileId={profile.id}
          name={profile["username"]}
          avatarUrl="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
          description={profile["profile_description"]}
          changeSidepanelContent={this.displayFriendList}
        />
      );
    });
    return userList;
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

        <button onClick={this.displayChatList}>
          {"chats"}
        </button>
        <button onClick={this.displayFriendList}>
          {"friends"}
        </button>
        <button onClick={this.displayUserList}>
          {"users"}
        </button>

        <div className="contact-list slide-box slide-box_contact-list">
          {this.state.display === "chatList"
            ? "chat list"
            : this.state.display === "friendList"
              ? "friend list"
              : "user list"
          }

          {this.state.display === "chatList"
            ? this.getActiveChatList()
            : this.state.display === "friendList"
              ? this.getFriendList()
              : this.getUserList()
          }
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
    userList: state.profile.userList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserChatListAndInfo: (username, accessToken) =>
      dispatch(chatActions.getUserChatListAndInfo(username, accessToken)),
    getFriendList: (accessToken) =>
      dispatch(profileActions.getFriendList(accessToken)),
    getUserList: (accessToken) =>
      dispatch(profileActions.getUserList(accessToken)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidepanel);
