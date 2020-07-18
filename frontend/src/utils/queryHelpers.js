// @flow

import type { AuthorizedContext } from './AuthContext';

export type QueryParams = {[string]: any};
export type RequestMethod = 'GET' | 'POST';

type QueryInput = {
  onSuccess?: (any) => void,
  onFailure?: (any) => void,
  method: RequestMethod,
  url: string,
  params?: QueryParams,
  body?: QueryParams,
  headers?: QueryParams,
};

export const query = ({method, url, params, body, headers, onSuccess, onFailure}: QueryInput) => {

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
        onSuccess && onSuccess(result);
      },
      (error) => {
        onFailure && onFailure(error);
      }
    );
};

type MyQueryInput = {
  method: RequestMethod,
  authContext?: AuthorizedContext,
  endpoint: string,
  params?: QueryParams,
  body?: QueryParams,
  onSuccess?: (any) => void,
  onFailure?: (data: any, errorCode: ?string, errorMessage: ?string) => void

};

export const myQuery = ({method, authContext, endpoint, params, body, onSuccess, onFailure}: MyQueryInput) => {
  const url = '/api/' + endpoint;
  const headers = authContext ? {'Authorization': authContext.token} : undefined;
  query({
    onSuccess: onSuccess && ((result) => {
      console.log('success response?');
      // if response is shaped like {result: 'FAILURE'}, it didn't actually work, even if it returned properly
      if(result.result === 'failure') {
        onFailure && onFailure(result.data, result.errorCode, result.errorMessage);
      } else {
        onSuccess(result);
      }
    }),
    onFailure: onFailure && ((error) => {

      console.log('failure response?');
      // all failures *should* look like this but maybe something horrible happened
      if(error.result === 'failure') {
        onFailure(error.data, error.errorCode, error.errorMessage);
      } else {
        onFailure(error);
      }
    }),
    method,
    url,
    params,
    body,
    headers
  });
}

