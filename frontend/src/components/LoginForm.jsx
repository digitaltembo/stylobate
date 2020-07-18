// @flow
import React from 'react';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import AuthContext, { type AuthorizedContext } from '../utils/AuthContext';
import {myQuery} from '../utils/queryHelpers';

import './LoginForm.css';

type Props = {
  onLogin?: (AuthorizedContext) => void
};

const LoginForm = ({onLogin}: Props) => {
  const [error, setError] = React.useState<?string>(null);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const login = React.useCallback((setAuthContext) => {
    myQuery({
      method: 'POST',
      endpoint: 'auth/login',
      body: { email, password },
      onSuccess: (result) => {
          const authContext = (result: AuthorizedContext);
          setError(null);
          setAuthContext && setAuthContext(authContext);
          onLogin && onLogin(authContext);
      },
      onFailure: (data, errorCode, errorMessage) => setError(errorMessage)
    });
  }, [setError, email, password, onLogin]);

  const updateField = (setter) => (event) => setter(event.target.value);

  return (
    <Container maxWidth="sm">
      <Paper>
        <form className="loginForm">
          <h1>Please Log In</h1>
          <div>
            <TextField
              required
              label="email"
              variant="outlined"
              value={email}
              onChange={updateField(setEmail)}
            />
          </div>
          <div>
            <TextField
              required
              label="password"
              variant="outlined"
              type="password"
              value={password}
              onChange={updateField(setPassword)}
            />
          </div>
          { error && <p>Error: {error}</p> }
          <div>
            <AuthContext.Consumer>
              {({setAuthContext}) => <Button 
                variant="contained" 
                color="secondary" 
                type="submit"
                onClick={(event) => {
                  event.preventDefault();
                  login(setAuthContext)
                }}>Login</Button>}
            </AuthContext.Consumer>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;