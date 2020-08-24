import React from "react";
import { connect } from "react-redux";

import WebSocketInstance from "../websocket";
import * as chatActions from "../store/actions/chat";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageInput: { content: "", rows: 1 },
    };
    this.props.changeChatId(this.props.match.params.chatID);
    WebSocketInstance.fetchMessageList(this.props.match.params.chatID);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.chatID !== prevProps.match.params.chatID) {
      this.props.changeChatId(this.props.match.params.chatID);
      WebSocketInstance.fetchMessageList(this.props.match.params.chatID);
    }

    this.scrollToBottom();
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

  getRecipientId = () => {
    const chatId = parseInt(this.props.match.params.chatID);
    let participantList;
    for (let i = 0; i < this.props.chatList.length; i++) {
      if (this.props.chatList[i].id === chatId)
        participantList = this.props.chatList[i].participant_list;
    }
    return participantList.indexOf(parseInt(this.props.userId)) === 0
      ? participantList[1]
      : participantList[0];
  };

  renderMessageList = (messageList) => {
    return messageList.map((message, i) => (
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
    return (
      <div className="column-right">
        <div className="chat-header-box">
          <img
            className="profile-image"
            src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
            alt=""
          />
          <div className="chat-header-box__text-wrapper">
            <h6 className="chat-header-box__profile_name">Robo Cop</h6>
            <p className="chat-header-box__profile-description">
              Layin' down the law since like before Christ...
            </p>
          </div>
          <span className="settings-tray">
            <i className="material-icons">cached</i>
            <i className="material-icons">message</i>
            <i className="material-icons">menu</i>
          </span>
        </div>

        <ul className="chat-log slide-box slide-box_chat-log">
          {messageList && this.renderMessageList(messageList)}
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
    messageList: state.chat.messageList,
    chatList: state.chat.chatList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeChatId: (chatId) => dispatch(chatActions.changeChatId(chatId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
