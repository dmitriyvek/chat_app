import React from "react";
import { connect } from "react-redux";

import * as chatActions from "../store/actions/chat";
import * as profileActions from "../store/actions/profile";
import Profile from "../components/Profile";
import Contact from "../components/Contact";
import CurrentUserProfile from "../components/CurrentUserProfile";

class Sidepanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "chatList",
    };
    this.changeSidepanelContent = this.changeSidepanelContent.bind(this);
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.token !== null && newProps.username !== null) {
  //     this.getUserChats(newProps.token, newProps.username);
  //   }
  // }

  componentDidMount() {
    if (this.props.token !== null && this.props.userId !== null) {
      this.props.getUserChatListAndInfo(this.props.token, this.props.userId);
    }
  }

  changeSidepanelContent(e) {
    if (this.state.display === "chatList") {
      this.setState({ display: "friendList" });
      if (!this.props.friendList.length) {
        this.props.getFriendList(this.props.token, this.props.userId);
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
          style={{ background: chat["active"] ? "#d3e7fb" : null }}
          name={
            chat["last_message"]
              ? chat["last_message"]["author"]["username"]
              : ""
          }
          avatarUrl={
            chat["last_message"]
              ? chat["last_message"]["author"]["avatar_url"]
              : ""
          }
          lastMessage={
            chat["last_message"] ? chat["last_message"]["content"] : ""
          }
          lastMessageTime={
            chat["last_message"] ? chat["last_message"]["timestamp"] : ""
          }
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
          decription={profile["profile_description"]}
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
    token: state.auth.token,
    userId: state.auth.userId,
    chatList: state.chat.chatList,
    friendList: state.profile.friendList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserChatListAndInfo: (username, token) =>
      dispatch(chatActions.getUserChatListAndInfo(username, token)),
    getFriendList: (token, userId) =>
      dispatch(profileActions.getFriendList(token, userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidepanel);
