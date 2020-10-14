import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import WebSocketInstance from "./websocket";
import BaseRouter from "./routes";
import * as authActions from "./store/actions/auth";
import * as chatActions from "./store/actions/chat";

class App extends React.Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
    this.initialiseWebSocket();
  }

  initialiseWebSocket = () => {
    if (Object.keys(WebSocketInstance.callbackList).length === 0) {
      WebSocketInstance.addCallbackList(
        this.props.newMessage,
        this.props.newChat
      );
    }
  };

  render() {
    return (
      <Router>
        <BaseRouter />
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(authActions.authCheckState()),
    newMessage: (message) => dispatch(chatActions.newMessage(message)),
    newChat: (chat) => dispatch(chatActions.newChat(chat)),
  };
};

export default connect(null, mapDispatchToProps)(App);
