// @flow
import React from 'react';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Header from './components/Header';

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
  children: React$Node
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
    <Header />
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route exact path="/login">
        <Login/>
      </Route>
    </Switch>
  </Router>
);

export default Routes;