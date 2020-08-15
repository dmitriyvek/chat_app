import React from "react";
import { NavLink } from "react-router-dom";

const Contact = (props) => (
  <NavLink to={`${props.chatId}`}>
    <div className="contact-box">
      <img className="profile-image" src={props.avatarUrl} alt="" />
      <div className="contact-box__text-wrapper">
        <h6 className="contact-box__profile_name">{props.name}</h6>
        <p className="contact-box__last-message-text">{props.lastMessage}</p>
      </div>
      <span className="contact-box__last-message-time">
        {props.lastMessageTime}
      </span>
    </div>
    <hr />
  </NavLink>
);

export default Contact;
