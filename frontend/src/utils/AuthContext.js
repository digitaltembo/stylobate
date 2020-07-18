// @flow
import React from 'react';

import { useHistory } from "react-router-dom";

export type AuthorizedContext = {
  id: number,
  email: string,
  isSuperuser: boolean,
  token: string
};

type AuthContextState = {
  authContext: ?AuthorizedContext,
  setAuthContext?: (?AuthorizedContext) => void,
  logout: () => void
};

const AuthContext = React.createContext<AuthContextState>({
  authContext: null,
  logout: () => {}
});

const AUTH_CONTEXT_STORAGE_KEY = 'auth-context';


const getStoredAuthContext = () => {
  const authContextStr = localStorage.getItem(AUTH_CONTEXT_STORAGE_KEY);
  if(authContextStr == null){
    return null;
  } 
  try {
    const authContext = JSON.parse(authContextStr);

    if(authContext.id == null && authContext.email == null && authContext.isSuperuser == null && authContext.token == null) {
      return null;
    }
    return authContext;
  }
  catch(error) {
    return null;
  }
};

const setStoredAuthContext = (authContext: ?AuthorizedContext) => {
  if (authContext) {
    localStorage.setItem(AUTH_CONTEXT_STORAGE_KEY, JSON.stringify(authContext));
  }
  else {
    localStorage.removeItem(AUTH_CONTEXT_STORAGE_KEY);
  }
  console.log('setting local storage!');
}

type Props = {children: React$Node};

export const AuthContextWrapper = ({children}: Props) => {
  const [authContext, setAuthContext] = React.useState<?AuthorizedContext>(getStoredAuthContext());

  const storeAuthContext = React.useCallback((authContext: ?AuthorizedContext) => {
    setStoredAuthContext(authContext);
    setAuthContext(authContext);
  }, [setAuthContext]);

  const history = useHistory();

  const logout = React.useCallback(() => {
    setAuthContext(null);
    setStoredAuthContext(null);
    history && history.push('/');
  }, [setAuthContext, history]);

  return (
    <AuthContext.Provider value={{authContext, logout, setAuthContext: storeAuthContext}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;