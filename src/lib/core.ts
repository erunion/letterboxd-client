/* eslint-disable @typescript-eslint/no-explicit-any */
import * as crypto from 'crypto';

import { v4 as uuidv4 } from 'uuid';

export const BASE_URL = 'https://api.letterboxd.com/api/v0';

export interface Auth {
  accessToken?: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface APIResponse {
  data?: any;
  status: number;
}

function buildUrl(url: string, params?: Record<string, any>) {
  const urlObj = new URL(`${BASE_URL}${url}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
  }

  return urlObj.toString();
}

function buildParams(
  auth: Auth,
  method: string,
  url: string,
  body?: Record<string, any>,
  params: Record<string, any> = {},
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
  auth?: Auth;
  body?: Record<string, any>;
  headers?: Record<string, string>;
  method: 'delete' | 'get' | 'patch' | 'post';
  params?: Record<string, any>;
  path: string;
}) {
  let form: URLSearchParams;

  if (opts.headers && opts.body && opts.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    form = new URLSearchParams();

    Object.entries(opts.body).forEach(([key, value]) => {
      form.append(key, value);
    });
  }

  const params = buildParams(opts.auth, opts.method, opts.path, form || opts.body, opts.params);
  const url = buildUrl(opts.path, params);

  return fetch(url, {
    method: opts.method,
    body: form || (opts.body ? JSON.stringify(opts.body) : undefined),
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
    } as T & { res: Response };

    return response;
  });
}
