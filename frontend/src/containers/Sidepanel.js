import axios from "axios";
import React from "react";
import { connect } from "react-redux";

import * as actions from "../store/actions/auth";
import Profile from "./Profile";
import Contact from "../components/Contact";

class Sidepanel extends React.Component {
  state = {
    chatList: [],
  };

  // componentWillReceiveProps(newProps) {
  //   if (newProps.token !== null && newProps.username !== null) {
  //     this.getUserChats(newProps.token, newProps.username);
  //   }
  // }

  // componentDidUpdate() {
  //   if (this.props.token !== null && this.props.username !== null) {
  //     this.getUserChats(this.props.token, this.props.username);
  //   }
  // }

  componentDidMount() {
    if (this.props.token !== null && this.props.username !== null) {
      this.getUserChats(this.props.token, this.props.username);
    }
  }

  getUserChats = (token, username) => {
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .get(`http://127.0.0.1:8000/chats/?username=${username}`)
      .then((res) => this.setState({ chatList: res.data }));
  };

  render() {
    const activeChats = this.state.chatList.map((chat) => {
      return (
        <Contact
          key={chat.id}
          chatId={`/${chat.id}`}
          name="Robo cop"
          avatarUrl="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
          lastMessage="Hey, you're arrested! Lorem ipsum dolor sit amet"
          lastMessageTime="13:21"
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
    token: state.token,
    username: state.username,
  };
};

export default connect(mapStateToProps)(Sidepanel);
