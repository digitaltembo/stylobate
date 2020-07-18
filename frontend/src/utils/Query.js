// @flow

/*

  Defines Query, MyQuery, MyGet, MyPost components, basically for use on pages that are rendered based on return from requests

  Query is the basic structure, and would be used looking something like this:
  <Query method='GET' url='wowee.com'>
    {(response) => (
      <>
        <Loading response={response}>
          <p>Huh, still loading</p>
        </Loading>
        <Success response={response}>
          {
            const success = (response.data): SuccessType;
            <SpecificSuccess with={success.a} props={success.b} />
          }
        </Success>
        <Failure response={response}>
          <p>Ah dang: {respnse.errorMessage || 'Generic Error'}
        </Failure>
      </>
    )}
  </Query>

  MyQuery and its ilk differ slightly in that it is designed around the structure that is expected with calls to the API
  of this webapp
   * Endpoint is used instead of url, with e.g. `auth/login` transformed into `/api/auth/login`
   * If the endpoint requires authorization, simply add the `authRequired` prop, and authorization credentials 
     will be processed from the AuthContext and added to the header of the request
*/

import React from 'react';

import AuthContext, { type AuthorizedContext } from './AuthContext';

import * as QH from './queryHelpers';

export type RequestStatus = 'LOADING' | 'SUCCESS' | 'FAILURE';
export type Response      = {
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
  method:   QH.RequestMethod,
  url:      string,
  params?:  QH.QueryParams,
  body?:    QH.QueryParams,
  headers?: QH.QueryParams,
  children: (Response) => React$Node
};

const Query = ({method, url, params, body, headers, children}: Props) => {
  const [response, setResponse] = React.useState<Response>({
    status: 'LOADING',
    data: {},
  });

  React.useEffect(() => {
    QH.query({
      onSuccess: (result) => {
        setResponse({
          status: 'SUCCESS',
          data: result
        });
      },
      onFailure: (error) => {
        setResponse({
          status: 'SUCCESS',
          data: error
        });
      },
      method, 
      url, 
      params, 
      body, 
      headers
    });
  }, [setResponse]);
  
  return children(response);
};

export type MyGetProps = {
  endpoint: string,
  params?: QH.QueryParams,
  authRequired?: boolean,
  children: (Response) => React$Node
};
export type MyPostProps = {
  ...MyGetProps,
  body?: QH.QueryParams,
};

export type MyQueryProps = {
  ...MyPostProps,
  method: QH.RequestMethod,
};

type MyAuthedQueryProps = {
  method: QH.RequestMethod,
  authContext?: AuthorizedContext,
  endpoint: string,
  params?: QH.QueryParams,
  body?: QH.QueryParams,
  children: (Response) => React$Node
};

const MyAuthedQuery = ({method, endpoint, params, body, authContext, children}: MyAuthedQueryProps) => {
  const [response, setResponse] = React.useState<Response>({
    status: 'LOADING',
    data: {},
  });

  React.useEffect(() => {
    QH.myQuery({
      onSuccess: (result) => {
        setResponse({
          status: 'SUCCESS',
          data: result
        });      
      },
      onFailure: (error, errorCode, errorMessage) => {
        setResponse({
          status: 'FAILURE',
          data: error,
          errorCode: errorCode || undefined,
          errorMessage: errorMessage || undefined,
        });      
      },
      method, 
      authContext,
      endpoint, 
      params, 
      body
    });
  }, [setResponse]);
  
  return children(response);
};

export const MyQuery = ({method, endpoint, params, body, authRequired, children}:  MyQueryProps) => {
  const baseProps = {method, endpoint, params, body, children};
  if (authRequired) {
    return (
      <AuthContext.Consumer>
        {({authContext}) => (
          (authContext) 
            ? <MyAuthedQuery authContext={authContext} {...baseProps} />
            : <MyAuthedQuery {...baseProps} /> // this will presumably just return an error, but that is there fault for making an auth'd api call without auth
        )}
      </AuthContext.Consumer>
    );
  }

  return <MyAuthedQuery {...baseProps} />
};

export const MyPost = (myPostProps: MyPostProps) => (
  <MyQuery {...myPostProps} method='POST' />
);

export const MyGet = (myGetProps: MyGetProps) => (
  <MyQuery {...myGetProps} method='GET' />
);

export default Query;