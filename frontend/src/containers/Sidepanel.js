import axios from "axios";
import React from "react";
import { connect } from "react-redux";

import * as chatActions from "../store/actions/chat";
import Profile from "./Profile";
import Contact from "../components/Contact";

class Sidepanel extends React.Component {
  // componentWillReceiveProps(newProps) {
  //   if (newProps.token !== null && newProps.username !== null) {
  //     this.getUserChats(newProps.token, newProps.username);
  //   }
  // }

  componentDidMount() {
    if (this.props.token !== null && this.props.userId !== null) {
      this.props.getUserChatList(this.props.token, this.props.userId);
    }
  }

  render() {
    const activeChats = this.props.chatList.map((chat) => {
      console.log(chat);
      return (
        <Contact
          key={chat.id}
          chatId={`/${chat.id}`}
          name={chat["last_message"]["author"]}
          avatarUrl="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
          lastMessage={chat["last_message"]["content"]}
          lastMessageTime={chat["last_message"]["timestamp"]}
        />
      );
    });

    return (
      <div className="column-left">
        <Profile />

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

        <div className="contact-list slide-box slide-box_contact-list">
          {activeChats}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserChatList: (username, token) =>
      dispatch(chatActions.getUserChatList(username, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidepanel);
