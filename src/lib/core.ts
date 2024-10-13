/* eslint-disable @typescript-eslint/no-explicit-any */
export const BASE_URL = 'https://api.letterboxd.com/api/v0';

export interface Auth {
  accessToken?: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface APIResponse {
  data: any;
  reason: string;
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

export async function request<T extends APIResponse>(opts: {
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

  const url = buildUrl(opts.path, opts.params);

  return fetch(url, {
    method: opts.method,
    body: form || (opts.body ? JSON.stringify(opts.body) : undefined),
    headers: {
      ...opts.headers,
      ...(opts.auth.accessToken ? { Authorization: `Bearer ${opts.auth.accessToken}` } : {}),
    },
  }).then(async res => {
    // This mess allows us to easily handle `res.json()`, and falling back to `res.text()` if our
    // JSON response isn't actually JSON without having to clone the response.
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
