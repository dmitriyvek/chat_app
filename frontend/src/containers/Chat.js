import React from "react";
import { connect } from "react-redux";

import WebSocketInstance from "../websocket";
import * as chatActions from "../store/actions/chat";
import ChatHeader from "../components/ChatHeader";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInput: { content: "", rows: 1 },
    };
    this.handleChatLogScroll = this.handleChatLogScroll.bind(this);
    this.changeChat();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.chatID !== prevProps.match.params.chatID) {
      this.changeChat();
    }
    this.scrollToBottom();
  }

  changeChat() {
    this.props.getChatData(this.props.token, this.props.match.params.chatID, 0);
    this.props.changeChatId(this.props.match.params.chatID);
  }

  messageChangeHandler = (event) => {
    let newMessageInput = {
      ...this.state.messageInput,
      content: event.target.value,
    };

    event.target.rows = 1;
    // console.log(event.target.scrollHeight, event.target.offsetHeight);
    const currentRows = (event.target.scrollHeight - 12) / 20;
    event.target.rows = currentRows;
    if (currentRows >= 3) {
      newMessageInput.rows = 3;
      event.target.scrollTop = event.target.scrollHeight;
    } else {
      newMessageInput.rows = currentRows;
    }

    this.setState({
      messageInput: newMessageInput,
    });
  };

  sendMessageHandler = (event) => {
    event.preventDefault();
    const messageObject = {
      chatId: this.props.match.params.chatID,
      recipientId: this.props.companionProfile.id,
      authorId: this.props.userId,
      content: this.state.messageInput.content,
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      messageInput: { ...this.state.messageInput, content: "" },
    });
  };

  renderChatHeader = (companionProfile) => {
    return (
      <ChatHeader
        companionName={companionProfile.username}
        companionAvatarUrl={companionProfile.avatar_url}
        companionDescription={companionProfile.profile_description}
      />
    );
  };

  renderMessageList = (messageList) => {
    return messageList.map((message) => (
      <li
        name={console.log("aaa")}
        key={message.id}
        className={
          message.author === this.props.userId
            ? "chat-message-box chat-message-box_right"
            : "chat-message-box chat-message-box_left"
        }
      >
        {message.content}
      </li>
    ));
  };

  scrollToBottom = () => {
    // this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    this.messagesEnd.scrollIntoView();
  };

  handleChatLogScroll = (e) => {
    if (e.target.scrollTop === 0 && this.props.lastMessageIndex !== null) {
      if (this.props.lastMessageIndex !== null) {
        this.props.getChatData(
          this.props.token,
          this.props.match.params.chatID,
          this.props.lastMessageIndex
        );
      }
    }
  };

  render() {
    const messageList = this.props.messageList;
    const companionProfile = this.props.companionProfile;
    return (
      <div className="column-right">
        {companionProfile && this.renderChatHeader(companionProfile)}
        <ul
          className="chat-log slide-box slide-box_chat-log"
          onScroll={this.handleChatLogScroll}
        >
          {messageList.length && this.renderMessageList(messageList)}
          <div
            // style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          ></div>
        </ul>

        <form className="message-input-box" onSubmit={this.sendMessageHandler}>
          <i className="message-input-box__emojis-icon material-icons">
            sentiment_very_satisfied
          </i>
          <textarea
            rows={this.state.messageInput.rows}
            className="message-input-box__input"
            onChange={this.messageChangeHandler}
            value={this.state.messageInput.content}
            required
            type="text"
            placeholder="Type your message here..."
          />
          <button className="message-input-box__submit-button" type="submit">
            <i className="material-icons">send</i>
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    token: state.auth.token,
    messageList: state.chat.messageList,
    lastMessageIndex: state.chat.lastMessageIndex,
    chatList: state.chat.chatList,
    companionProfile: state.chat.companionProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChatData: (token, chatId, last_message_index) =>
      dispatch(chatActions.getChatData(token, chatId, last_message_index)),
    changeChatId: (chatId) => dispatch(chatActions.changeChatId(chatId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
