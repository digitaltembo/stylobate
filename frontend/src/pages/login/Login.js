// @flow
import React from 'react';

import { useHistory } from "react-router-dom";

import LoginForm from '../../components/LoginForm';

const Login = () => {
  const history = useHistory();
  const redirect = React.useCallback((context) => {
    console.log(context);
    history.push('/');
  }, [history]);

  return <LoginForm onLogin={redirect} />;

};

export default Login;