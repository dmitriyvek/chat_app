import React from "react";
import { connect } from "react-redux";

import * as authActions from "../store/actions/auth";

class AuthPage extends React.Component {
  state = {
    loginForm: true,
  };

  changeForm = () => {
    this.setState({ loginForm: !this.state.loginForm });
  };

  authenticate = (event) => {
    event.preventDefault();
    if (this.state.loginForm) {
      if (event.target.username.value && event.target.password.value) {
        this.props.login(
          event.target.username.value,
          event.target.password.value
        );
      }
    } else {
      if (
        event.target.username.value &&
        event.target.password.value &&
        event.target.password.value === event.target.password2.value
      ) {
        this.props.signup(
          event.target.username.value,
          event.target.password.value,
          event.target.password2.value
        );
      }
    }
  };

  render() {
    return (
      <div className="container">
        {this.props.loading ? (
          <p>Loading</p>
        ) : (
          <div>
            <form method="POST" onSubmit={this.authenticate}>
              {this.state.loginForm ? (
                <div>
                  <input name="username" type="text" placeholder="username" />
                  <input
                    name="password"
                    type="password"
                    placeholder="password"
                  />
                </div>
              ) : (
                <div>
                  <input name="username" type="text" placeholder="username" />
                  <input
                    name="password"
                    type="password"
                    placeholder="password"
                  />
                  <input
                    name="password2"
                    type="password"
                    placeholder="password confirm"
                  />
                </div>
              )}

              <button type="submit">Authenticate</button>
            </form>

            <button onClick={this.changeForm}>Switch</button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (userName, password) =>
      dispatch(authActions.authLogin(userName, password)),
    // actions.authLogin(userName, password)(dispatch),
    signup: (username, password1, password2) =>
      dispatch(authActions.authSignup(username, password1, password2)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
