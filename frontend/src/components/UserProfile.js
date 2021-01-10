import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import WebSocketInstance from "../websocket";
import * as chatActions from "../store/actions/chat";
import { isSubList } from "../utility";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.onUserClick = this.onUserClick.bind(this);
  }

  newFriendCreation = (e) => {
    const idList = {
      userId: this.props.userId,
      friendId: this.props.profileId,
    };
    WebSocketInstance.newFriendCreation(idList);
    this.props.history.push(`/`);
    // this.props.history.push(`/${this.props.chatId}`);
    this.props.changeSidepanelContent();
    this.props.setActiveChatId(null);
    // this.props.setActiveChatId(this.props.chatId);
  };

  onUserClick(e) {
    const friendList = this.props.friendList;
    for (let i = 0; i < friendList.length; i++) {
      if (friendList[i]["id"] == this.props.profileId) {
        this.props.changeSidepanelContent();
        return;
      }
    }
    this.newFriendCreation(e);
  }

  render() {
    return (
      <div onClick={this.onUserClick}>
        <div className="contact-box">
          <img className="profile-image" src={this.props.avatarUrl} alt="" />
          <div className="contact-box__text-wrapper">
            <h6 className="contact-box__profile_name">{this.props.name}</h6>
            <p className="contact-box__last-message-text">
              {this.props.description}
            </p>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    chatId: state.chat.chatId,
    friendList: state.profile.friendList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChatId: (newActiveChatId) =>
      dispatch(chatActions.setActiveChatId(newActiveChatId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Profile));
