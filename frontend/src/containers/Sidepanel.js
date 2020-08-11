import React from "react";

class Sidepanel extends React.Component {
  render() {
    return (
      <div className="column-left">
        <div className="profile-info-box">
          <img
            className="profile-image"
            src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/filip.jpg"
            alt="Profile img"
          />
          <span className="settings-tray">
            <i className="material-icons">cached</i>
            <i className="material-icons">message</i>
            <i className="material-icons">menu</i>
          </span>
        </div>

        <div className="contact-search-box">
          <div className="contact-search-box__wrapper">
            <i className="material-icons">search</i>
            <input
              className="contact-search-input"
              placeholder="Search here"
              type="text"
            />
          </div>
        </div>

        <div className="contact-list slide-box slide-box_contact-list">
          <div className="contact-box">
            <img
              className="profile-image"
              src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
              alt=""
            />
            <div className="contact-box__text-wrapper">
              <h6 className="contact-box__profile_name">Robo Cop</h6>
              <p className="contact-box__last-message-text">
                Hey, you're arrested! Lorem ipsum dolor sit amet
              </p>
            </div>
            <span className="contact-box__last-message-time">13:21</span>
          </div>
          <hr />
        </div>

        <div className="application-settings-tray"></div>
      </div>
    );
  }
}

export default Sidepanel;
