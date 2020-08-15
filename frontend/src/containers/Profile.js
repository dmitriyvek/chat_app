import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../store/actions/auth";

const Profile = (props) => {
  const history = useHistory();
  const onLogoutBtnClick = () => {
    props.logout();
    history.push("/");
  };

  return (
    <div className="profile-info-box">
      <img
        className="profile-image"
        src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/filip.jpg"
        alt="Profile img"
      />
      <p>{props.username}</p>
      <span className="settings-tray">
        <button
          className="settings-tray__logout-btn"
          onClick={onLogoutBtnClick}
          className="logout-btn"
        >
          <i className="material-icons">exit_to_app</i>
        </button>
        <i className="material-icons">message</i>
        <i className="material-icons">menu</i>
      </span>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
