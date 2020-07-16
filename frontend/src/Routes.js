// @flow
import React from 'react';

import Home from './pages/home/Home';
import AuthContext from './utils/AuthContext';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

type RouteProps = {
  path: string,
  exact: boolean,
};

const AuthRoute = (routeProps: RouteProps) => (
  <AuthContext.Consumer>
    {({authContext}) => authContext && <Route {...routeProps}/>}
  </AuthContext.Consumer>
);

const SuperAuthRoute = (routeProps: RouteProps) => (
  <AuthContext.Consumer>
    {({authContext}) => authContext && authContext.isSuperuser && <Route {...routeProps}/>}
  </AuthContext.Consumer>
);


const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
    </Switch>
  </Router>
);

export default Routes;