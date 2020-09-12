import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as chatActions from "../store/actions/chat";

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.contactBox = React.createRef();
    this.onContactBoxClick = this.onContactBoxClick.bind(this);
  }

  onContactBoxClick(e) {
    this.props.setActiveChatId(this.props.chatId);
    this.props.history.push(`/${this.props.chatId}`);
  }

  render() {
    return (
      <>
        <div
          className="contact-box"
          ref={this.contactBox}
          onClick={this.onContactBoxClick}
          style={this.props.style}
        >
          <img className="profile-image" src={this.props.avatarUrl} alt="" />
          <div className="contact-box__text-wrapper">
            <h6 className="contact-box__profile_name">{this.props.name}</h6>
            <p className="contact-box__last-message-text">
              {this.props.lastMessage}
            </p>
          </div>
          <span className="contact-box__last-message-time">
            {this.props.lastMessageTime}
          </span>
        </div>
        <hr />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChatId: (newActiveChatId) =>
      dispatch(chatActions.setActiveChatId(newActiveChatId)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Contact));
