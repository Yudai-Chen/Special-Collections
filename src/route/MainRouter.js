import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import MainPage from "../pages/mainpage/Mainpage";
import MediaRouter from "./MediaRouter";

export default class MainRouter extends Component {
  render() {
    return (
      <HashRouter>
        <Route path="/media" component={MediaRouter} />
        <Route path="/" component={MainPage} />
      </HashRouter>
    );
  }
}
