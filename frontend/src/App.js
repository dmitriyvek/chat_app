import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import BaseRouter from "./routes";
import * as authActions from "./store/actions/auth";

class App extends React.Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

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
  };
};

export default connect(null, mapDispatchToProps)(App);
