/* eslint-disable @typescript-eslint/no-explicit-any */
import * as crypto from 'crypto';

import 'isomorphic-fetch';
import { v4 as uuidv4 } from 'uuid';

export const BASE_URL = 'https://api.letterboxd.com/api/v0';

export interface Auth {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
}

export interface APIResponse {
  status: number;
  data?: any;
}

function applyAuth(accessToken: string, headers: Record<string, string> = {}) {
  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  };
}

function buildUrl(url: string, params?: Record<string, any>) {
  const urlObj = new URL(`${BASE_URL}${url}`);

  if (params) {
    for (const key in params) {
      urlObj.searchParams.set(key, params[key]);
    }
  }

  return urlObj.toString();
}

function buildParams(
  auth: Auth,
  method: string,
  url: string,
  body?: Record<string, any>,
  params: Record<string, any> = {}
) {
  const fullParams = params;
  fullParams.apikey = auth.apiKey;
  fullParams.nonce = uuidv4();
  fullParams.timestamp = Math.floor(Date.now() / 1000);

  const sigBase = [
    method.toUpperCase(),
    buildUrl(url, fullParams),
    body ? (body instanceof URLSearchParams ? body.toString() : JSON.stringify(body)) : '',
  ].join('\u0000');

  const signature = crypto.createHmac('sha256', auth.apiSecret).update(sigBase).digest('hex').toLowerCase();

  return { signature, fullParams };
}

export function request<T extends APIResponse>(opts: {
  method: 'get' | 'post' | 'patch' | 'delete';
  path: string;
  auth?: Auth;
  params?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
}) {
  let formBody;

  if (opts.headers && opts.body && opts.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    formBody = new URLSearchParams();

    for (const key in opts.body) {
      formBody.append(key, opts.body[key]);
    }
  }

  const { signature, fullParams } = buildParams(opts.auth, opts.method, opts.path, formBody || opts.body, opts.params);

  applyAuth(opts.auth.accessToken, opts.headers);

  return fetch(buildUrl(opts.path, fullParams), {
    method: opts.method,
    body: formBody || (opts.body ? JSON.stringify(opts.body) : undefined),
    headers: {
      ...opts.headers,
      Authorization: `Signature ${signature}`,
    },
  }).then(async res => {
    const response: {
      res: Response;
      status: T['status'];
      data: T['data'];
    } = {
      res,
      status: res.status,
      data: await res.json(),
    };

    return response;
  });
}
