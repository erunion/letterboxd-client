import fetch, { Response } from 'node-fetch';

import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

let BASE_URL = 'https://api.letterboxd.com/api/v0';

export default class Client {
    private accessToken: string;
    private apiKey: string;
    private apiSecret: string;

    constructor (apiKey: string, apiSecret: string, accessToken?: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;

        if (accessToken) {
            this.accessToken = accessToken;
        }
    }

    get(path: string, params?: object) {
        return this.request('GET', path, params);
    }

    post(path: string, body: object, headers?: object) {
        return this.request('POST', path, {}, body, headers);
    }

    patch(path: string, body: object) {
        return this.request('PATCH', path, body);
    }

    delete(path: string) {
        return this.request('DELETE', path);
    }

    requestToken(username: string, password: string) {
        if (this.accessToken) {
            throw new Error('You can not retrieve tokens on a client that has already been configured with a token. Create a client without providing any parameters to the constructor');
        }

        return this.request('POST', '/auth/token', {}, {
            grant_type: 'password',
            username: username,
            password: password
        }, {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        });
    }

    private request(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, params?: { [x: string]: any }, body?: {[x: string]: any}, headers?: {[x: string]: any}) {
        let formBody = undefined;

        if (headers && body && (headers['Content-Type'] === 'application/x-www-form-urlencoded')) {
            formBody = new URLSearchParams();

            for (let key in body) {
                formBody.append(key, body[key]);
            }        
        }

        let {signature, fullParams} = this.params(method, path, formBody ? formBody : body, params);

        this.applyAuth(headers);

        return fetch(this.buildUrl(path, fullParams), {
            method: method,
            body: formBody ? formBody : ( body ? JSON.stringify(body) : undefined),
            headers: {
                ...headers,
                ...{Authorization: `Signature ${signature}`}
            }
        })
        .then(async (res) => {
            let response: {
                res: Response,
                json: {[x: string]: any}
            } = { 
                res: res, 
                json: await res.json() as object
            };

            return response;
        });
    }

    private applyAuth(headers?: {[x: string]: any}) {
        if (!headers) {
            headers = {};
        }

        headers.Authorization = 'Bearer ' + this.accessToken;

        return headers;
    }

    private params(method: string, url: string, body?: {[x: string]: any}, params?: {[x: string]: any}) {

        let fullParams = params;

        if (!fullParams) {
            fullParams = {};
        }

        fullParams.apikey = this.apiKey;
        fullParams.nonce = uuidv4();
        fullParams.timestamp = timestamp();

        let sigBase = [
            method.toUpperCase(),
            this.buildUrl(url, fullParams),
            (body ? (body instanceof URLSearchParams ? body.toString() : JSON.stringify(body) ) : '')
        ].join('\u0000');


        let signature = crypto.createHmac("sha256", this.apiSecret)
            .update(sigBase)
            .digest("hex")
            .toLowerCase();

        return { signature, fullParams };
    }

    private buildUrl(url: string, params?: {[x: string]: any}) {
        let urlObj = new URL(`${BASE_URL}${url}`);

        if (params) {
            for (let key in params) {
                urlObj.searchParams.set(key, params[key]);
            }
        }

        return urlObj.toString();
    }
}

function timestamp() {
    return Math.floor(Date.now() / 1000)
}

/*
TODO:

class LetterboxdItem {
    public id: string;

    constructor (body: {[key: string]: any}, headers: {[key: string]: string}) {
        // From the docs
        this.id = headers['x-letterboxd-identifier'];
    }
}
class Film extends LetterboxdItem {
    constructor (body: {[key: string]: any}, headers: {[key: string]: string}) {
        super(body, headers);

    }
}
*/