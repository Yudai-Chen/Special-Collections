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
import ItemView from "../containers/ItemView";
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
      <PrivateRoute path={PATH_PREFIX + "/admin/items"}>
        <ProjectsPage />
      </PrivateRoute>
      <PrivateRoute path={PATH_PREFIX + "/admin/home"}>
        <Home />
      </PrivateRoute>
      <Redirect to={PATH_PREFIX + "/admin/home"} />
    </Switch>
  );
};

export const ProjectpageRouter = () => {
  return (
    <Router>
      <PrivateRoute path={PATH_PREFIX + "/admin/items/:itemId"}>
        <ItemView />
      </PrivateRoute>
    </Router>
  );
};

export const MainRouter = () => {
  return (
    <Router>
      <Switch>
        {/* <PrivateRoute
          path={PATH_PREFIX + "/media/:mediaId"}
        >
          <ImageDetails />
        </PrivateRoute>
        <PrivateRoute
          path={PATH_PREFIX + "/note/:targetList"}
        >
          <NewNote />
        </PrivateRoute> */}
        <PrivateRoute path={PATH_PREFIX + "/admin"}>
          <MainPage />
        </PrivateRoute>
        <Route path={PATH_PREFIX + "/login"}>
          <Welcome />
        </Route>
        <Redirect to={PATH_PREFIX + "/admin"} />
      </Switch>
    </Router>
  );
};
