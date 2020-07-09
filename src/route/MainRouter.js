import React, { Component } from "react";
import { Switch, HashRouter, Route } from "react-router-dom";
import MainPage from "../pages/mainpage/Mainpage";
import ImageDetails from "../pages/imageDetails/ImageDetails";
import NewNote from "../pages/newNote/NewNote";
import Welcome from "../pages/welcome/Welcome";

export default class MainRouter extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/media/:mediaId" component={ImageDetails} />
          <Route path="/note/:targetList" component={NewNote} />
          <Route path="/" component={MainPage} />
        </Switch>
      </HashRouter>
    );
  }
}
