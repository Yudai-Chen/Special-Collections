import React, { Component } from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import MainPage from "../pages/Mainpage";
import ImageDetails from "../pages/ImageDetails";
import NewNote from "../pages/NewNote";
import Welcome from "../pages/Welcome";
import { useCookies } from "react-cookie";

function PrivateRoute({ component: Component, authed, ...rest }) {
  const [cookies] = useCookies(["userInfo"]);
  return (
    <Route
      {...rest}
      render={(props) =>
        cookies.userInfo !== undefined ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export class MainRouter extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <PrivateRoute path="/media/:mediaId" component={ImageDetails} />
          <PrivateRoute path="/note/:targetList" component={NewNote} />
          <PrivateRoute path="/main" component={MainPage} />
          <Route path="/login" component={Welcome} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    );
  }
}
