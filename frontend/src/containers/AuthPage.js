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
        if (this.props.error) {
          window.alert("Login is fail");
        }
      } else {
        window.alert("Please specifiy your credentials");
      }
    } else {
      if (
        event.target.username.value &&
        event.target.password.value &&
        event.target.password2.value
      ) {
        if (event.target.password.value === event.target.password2.value) {
          this.props.signup(
            event.target.username.value,
            event.target.password.value,
          );
          if (this.props.error) {
            window.alert("Registration is fail");
          }
        } else {
          window.alert("Passwords did not matched"); 
        }
      } else {
        window.alert("All fields must be specified"); 
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
                  <div>
                    <input name="username" type="text" placeholder="username" />
                    <input
                      name="password"
                      type="password"
                      placeholder="password"
                    />
                  </div>
                  <button type="submit">Login</button>
                </div>
              ) : (
                <div>
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
                  <button type="submit">Register</button>
                </div>
              )}
            </form>
            <button onClick={this.changeForm}>
              {this.state.loginForm ? "Switch to register form" : "Switch to login form"}
            </button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (userName, password) =>
      dispatch(authActions.authLogin(userName, password)),
    // actions.authLogin(userName, password)(dispatch),
    signup: (username, password) =>
      dispatch(authActions.authSignup(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
