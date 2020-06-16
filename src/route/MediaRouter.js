import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import ImageDetails from "../pages/imageDetails/ImageDetails";

export default class MediaRouter extends Component {
  render() {
    return (
      <Switch>
        <Route path="/media/:mediaId" component={ImageDetails} />
      </Switch>
    );
  }
}
