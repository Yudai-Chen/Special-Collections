import React, { Component } from "react";
import { Switch, HashRouter, Route } from "react-router-dom";
import MainPage from "../pages/Mainpage";
import ImageDetails from "../pages/ImageDetails";
import NewNote from "../pages/NewNote";
import Welcome from "../pages/Welcome";

export default class MainRouter extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/media/:mediaId" component={ImageDetails} />
          <Route path="/note/:targetList" component={NewNote} />
          <Route path="/" component={Welcome} />
        </Switch>
      </HashRouter>
    );
  }
}
