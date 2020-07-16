// @flow
import React from 'react';

import AuthContext from './AuthContext';

type QueryParams = {[string]: any};
type RequestMethod = 'GET' | 'POST';
type RequestStatus = 'LOADING' | 'SUCCESS' | 'FAILURE';
type Response      = {
    status: RequestStatus, 
    data: any,
    errorCode?: string,
    errorMessage?: string
};

type LoadingProps = {
    status: RequestStatus,
    children: React$Node
};

const genStatusComponent = (renderForStatus: RequestStatus) => ({status, children}: LoadingProps) => {
    if (status === renderForStatus) {
        return children;
    }
    return null;
};
export const Loading = genStatusComponent('LOADING');
export const Success = genStatusComponent('SUCCESS');
export const Failure = genStatusComponent('FAILURE');


type Props = {
    method: RequestMethod,
    url: string,
    params?: QueryParams,
    body?: QueryParams,
    headers?: QueryParams,
    children: (Response) => React$Node
};

const Query = ({method, url, params, body, headers, children}: Props) => {
    const [status, setStatus] = React.useState<RequestStatus>('LOADING');
    const [response, setResponse] = React.useState<?any>(null);

    React.useEffect(() => {
        const paramString = params ? '?' + Object.keys(params).map((key: string) => `${key}=${params[key]}`).join('&') : '';
        const payload = method === 'GET' ? {method, headers} : {
            method,
            headers: {
                ...headers,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        fetch(url + paramString, payload)
            .then(res => res.json())
            .then(
                (result) => {
                    setStatus('SUCCESS');
                    setResponse(result);
                },
                (error) => {
                    setStatus('FAILURE');
                    setResponse(error);
                }
            );
    }, [setStatus, setResponse]);
    
    return children({status, data: response});
};

const myResponseWrapper = (children: (Response) => React$Node) => ({status, data}) => {
    if (status !== 'LOADING' && data.result === 'failure') {
        return children({
            status: 'FAILURE',
            data: data.data || {},
            errorCode: data.errorCode,
            errorMessage: data.errorMessage
        });
    }
    return children({status, data});
}

export type MyGetProps = {
    endpoint: string,
    params?: QueryParams,
    authRequired?: boolean,
    children: (Response) => React$Node
};


export const MyGet = ({endpoint, params, authRequired, children}: MyGetProps) => {
    const childrenWrapper = myResponseWrapper(children);

    const url = '/api/' + endpoint;

    if (authRequired) {
        return (
            <AuthContext.Consumer>
                {({authContext}) => {
                    if (authContext == null) {
                        // what am I supposed to do here?
                        return childrenWrapper({
                            status:    'FAILURE', 
                            data:      {}, 
                            errorCode: 'auth_required', 
                            errorMessage: 'Authorization is required on this endpoint'
                        });
                    }

                    const headers = {'Authorization': authContext && authContext.token} ;

                    return <Query method='GET' url={url} headers={headers} params={params}>{childrenWrapper}</Query>;
                }}
            </AuthContext.Consumer>
        );
    }
    return <Query method='GET' url={url} params={params}>{childrenWrapper}</Query>;
};

export type MyPostProps = {
    ...MyGetProps,
    body?: QueryParams,
};

export const MyPost = ({endpoint, params, body, authRequired, children}: MyPostProps) => {
    const childrenWrapper = myResponseWrapper(children);

    const url = '/api/' + endpoint;

    if (authRequired) {
        return (
            <AuthContext.Consumer>
                {({authContext}) => {
                    if (authContext == null) {
                        // what am I supposed to do here?
                        return childrenWrapper({
                            status:    'FAILURE', 
                            data:      {}, 
                            errorCode: 'auth_required', 
                            errorMessage: 'Authorization is required on this endpoint'
                        });
                    }

                    const headers = {'Authorization': authContext && authContext.token} ;

                    return <Query method='POST' url={url} headers={headers} params={params} body={body}>{childrenWrapper}</Query>;
                }}
            </AuthContext.Consumer>
        );
    }
    return <Query method='POST' url={url} params={params} body={body}>{childrenWrapper}</Query>;
};

export default Query;