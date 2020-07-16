// @flow
import React from 'react';

export type AuthorizedContext = {
    id: number,
    email: string,
    isSuperuser: boolean,
    token: string
};
export type AuthContextState = {
    authContext: ?AuthorizedContext,
    setAuthContext?: ((?AuthorizedContext => ?AuthorizedContext) | ?AuthorizedContext) => void
};

const AuthContext = React.createContext<AuthContextState>({
    authContext: null,
});

type Props = {children: React$Node};

export const AuthContextWrapper = ({children}: Props) => {
    const [authContext, setAuthContext] = React.useState<?AuthorizedContext>(null);

    return (
        <AuthContext.Provider value={{authContext, setAuthContext}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;