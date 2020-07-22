import React from "react";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import MainPage from "../components/Mainpage";
import ImageDetails from "../pages/ImageDetails";
import NewNote from "../pages/NewNote";
import Welcome from "../containers/Welcome";
import SearchPage from "../containers/SearchPage";
import Home from "../containers/Home";
import { useCookies } from "react-cookie";
import { PATH_PREFIX } from "../utils/Utils"


function PrivateRoute({ component: Component, authed, ...rest }) {
  const [cookies] = useCookies(["userInfo"]);
  console.log(cookies.userInfo);
  return (
    <Route
      {...rest}
      render={(props) =>
        cookies.userInfo !== undefined ? (
          <Component {...props} />
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
    <Router>
      <Switch>
        <Route path="items" component={ProjectsPage} />
        <Route path="search" component={SearchPage} />
        <Route path="home" component={Home} />
        <Redirect to="home" />
      </Switch>
    </Router>
  );
}

export const MainRouter = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute path={PATH_PREFIX + "/media/:mediaId"} component={ImageDetails} />
        <PrivateRoute path={PATH_PREFIX + "/note/:targetList"} component={NewNote} />
        <PrivateRoute path={PATH_PREFIX + "/main"} component={MainPage} />
        <Route path={PATH_PREFIX + "/login"} component={Welcome} />
        <Redirect from={PATH_PREFIX + "/"} to={PATH_PREFIX + "/login"} />
      </Switch>
    </Router>
  );
}
