import React from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import MainPage from "../containers/Mainpage";
import ImageDetails from "../containers/ImageDetails";
import NewNote from "../containers/NewNote";
import Welcome from "../containers/Welcome";
import Home from "../containers/Home";
import ProjectsPage from "../containers/ProjectsPage";
import Item from "../pages/Item";
import { useCookies } from "react-cookie";
import { PATH_PREFIX } from "../utils/Utils";

function PrivateRoute({ children, ...rest }) {
  const [cookies] = useCookies(["userInfo"]);
  return (
    <Route
      {...rest}
      render={(props) =>
        cookies.userInfo !== undefined ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: PATH_PREFIX + "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export const MainpageRouter = () => {
  return (
    <Switch>
      <PrivateRoute
        path={PATH_PREFIX + "/admin/items"}
        component={ProjectsPage}
      />
      <PrivateRoute path={PATH_PREFIX + "/admin/home"} component={Home} />
      <Redirect to={PATH_PREFIX + "/admin/home"} />
    </Switch>
  );
};

export const ProjectpageRouter = () => {
  return (
    <Router>
      <PrivateRoute
        path={PATH_PREFIX + "/admin/items/:itemId"}
        component={Item}
      />
    </Router>
  );
};

export const MainRouter = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute
          path={PATH_PREFIX + "/media/:mediaId"}
          component={ImageDetails}
        />
        <PrivateRoute
          path={PATH_PREFIX + "/note/:targetList"}
          component={NewNote}
        />
        <PrivateRoute path={PATH_PREFIX + "/admin"} component={MainPage} />
        <Route path={PATH_PREFIX + "/login"} component={Welcome} />
        <Redirect to={PATH_PREFIX + "/login"} />
      </Switch>
    </Router>
  );
};
