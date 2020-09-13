import React from "react";
import { connect } from "react-redux";

import WebSocketInstance from "../websocket";
import * as chatActions from "../store/actions/chat";
import Chat from "./Chat";

class RootChat extends React.Component {
  initialiseChat() {
    if (Object.keys(WebSocketInstance.callbackList).length === 0) {
      WebSocketInstance.addCallbackList(this.props.newMessage.bind(Chat));
    }
    WebSocketInstance.connect(this.props.userId);
  }

  componentDidMount() {
    if (this.props.userId) {
      this.initialiseChat();
    }
  }

  render() {
    return (
      <div className="column-right">
        <div className="chat-header-box"></div>

        <div className="message-input-box"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    newMessage: (message) => dispatch(chatActions.newMessage(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootChat);
