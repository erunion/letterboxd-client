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

  fullParams.signature = crypto.createHmac('sha256', auth.apiSecret).update(sigBase).digest('hex').toLowerCase();

  return fullParams;
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

  const params = buildParams(opts.auth, opts.method, opts.path, formBody || opts.body, opts.params);
  const url = buildUrl(opts.path, params);

  return fetch(url, {
    method: opts.method,
    body: formBody || (opts.body ? JSON.stringify(opts.body) : undefined),
    headers: {
      ...opts.headers,
      ...(opts.auth.accessToken ? { Authorization: `Bearer ${opts.auth.accessToken}` } : {}),
    },
  }).then(async res => {
    // This mess allows us to easily handle `res.json()`, and falling back to `res.text()` if our
    // JSON response isn't actually JSON, without having to clone the response.
    const buffer = await (await res.arrayBuffer().then(Buffer.from)).toString();

    let data;
    try {
      data = JSON.parse(buffer);
    } catch (err) {
      data = buffer;
    }

    const response = {
      res,
      status: res.status,
      data,
    } as { res: Response } & T;

    return response;
  });
}
