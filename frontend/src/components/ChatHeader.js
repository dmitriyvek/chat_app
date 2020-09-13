import React from "react";

const ChatHeader = (props) => (
  <div className="chat-header-box">
    <img className="profile-image" src={props.companionAvatarUrl} alt="" />
    <div className="chat-header-box__text-wrapper">
      <h6 className="chat-header-box__profile_name">{props.companionName}</h6>
      <p className="chat-header-box__profile-description">
        {props.companionDescription}
      </p>
    </div>
    <span className="settings-tray">
      <i className="material-icons">cached</i>
      <i className="material-icons">message</i>
      <i className="material-icons">menu</i>
    </span>
  </div>
);

export default ChatHeader;
