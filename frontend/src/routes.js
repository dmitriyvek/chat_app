import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import Chat from "./containers/Chat";
import Sidepanel from "./containers/Sidepanel";
import AuthPage from "./containers/AuthPage";

const BaseRouter = (props) => (
  <React.Fragment>
    {props.isAuthenticated ? (
      <div className="container">
        <Route exact path="/" component={Sidepanel} />
        <Route exact path="/" component={Chat} />
      </div>
    ) : (
      <Route exact path="/" component={AuthPage} />
    )}
  </React.Fragment>
);

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
  };
};

export default connect(mapStateToProps)(BaseRouter);
