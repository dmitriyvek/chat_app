import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import WebSocketInstance from "../websocket";
import * as authActions from "../store/actions/auth";

const Profile = (props) => {
  const history = useHistory();
  const onLogoutBtnClick = () => {
    props.logout();
    WebSocketInstance.disconnect();
    history.push("/");
  };

  return (
    <div className="profile-info-box">
      <img
        className="profile-image"
        src={props.userInfo.avatarUrl}
        alt="Profile img"
      />
      <p>{props.username}</p>
      <p>{props.userInfo.profileDescription}</p>
      <span className="settings-tray">
        <button
          className="settings-tray__logout-btn"
          onClick={onLogoutBtnClick}
          className="logout-btn"
        >
          <i className="material-icons">exit_to_app</i>
        </button>
        {/* <i className="material-icons">message</i>
        <i className="material-icons">menu</i> */}
      </span>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    userInfo: state.chat.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(authActions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
