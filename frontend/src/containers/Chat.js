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
    this.changeChat();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.chatID !== prevProps.match.params.chatID) {
      this.changeChat();
    }
    this.scrollToBottom();
  }

  changeChat() {
    this.props.changeChatId(this.props.match.params.chatID);
    this.props.getChatMessageAndParticipantList(
      this.props.token,
      this.props.match.params.chatID
    );
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
      recipientId: this.getRecipientId(),
      authorId: this.props.userId,
      content: this.state.messageInput.content,
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      messageInput: { ...this.state.messageInput, content: "" },
    });
  };

  getRecipientId = () =>
    this.props.participantList[0]["id"] === this.props.userId
      ? this.props.participantList[1]["id"]
      : this.props.participantList[0]["id"];

  renderChatHeader = (participanList) => {
    const companionProfile =
      participanList[0]["id"] === this.props.userId
        ? participanList[1]
        : participanList[0];
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
          message.author === this.props.username
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

  render() {
    const messageList = this.props.messageList;
    const participantList = this.props.participantList;
    return (
      <div className="column-right">
        {participantList.length && this.renderChatHeader(participantList)}
        <ul className="chat-log slide-box slide-box_chat-log">
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
    username: state.auth.username,
    token: state.auth.token,
    messageList: state.chat.messageList,
    chatList: state.chat.chatList,
    participantList: state.chat.participantList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChatMessageAndParticipantList: (token, chatId) =>
      dispatch(chatActions.getChatMessageAndParticipantList(token, chatId)),
    changeChatId: (chatId) => dispatch(chatActions.changeChatId(chatId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
