import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import qs from 'querystring';

let BASE_URL = 'https://api.letterboxd.com/api/v0/';

export default class Client {
    private accessToken: string;
    private req: AxiosInstance;
    private apiKey: string;
    private apiSecret: string;

    constructor (apiKey: string, apiSecret: string, accessToken?: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;

        let axiosConfig: AxiosRequestConfig = {
            baseURL: BASE_URL
        }

        if (accessToken) {
            this.accessToken = accessToken;

            axiosConfig.headers = {
                Authorization: 'Bearer ' + this.accessToken
            }
        }

        this.req = axios.create(axiosConfig);
    }

    private requireAccessToken() {
        if (!this.accessToken) {
            throw new Error('You must construct this library with an access token in order to make API requests');
        }
    }

    private request(method: Method, path: string, params?: object, body?: object) {
        this.requireAccessToken();

        // TODO: What does this return? Maybe we can have it use the objects below somehow. How do we identify the object type from just the object?
        return this.req.request({
            method: method,
            url: path,
            params: this.params(method, path, body, params)
        });
    }

    get(path: string) {
        return this.request('GET', path);
    }

    post(path: string, body: object) {
        return this.request('POST', path, body);
    }

    patch(path: string, body: object) {
        return this.request('PATCH', path, body);
    }

    delete(path: string) {
        return this.request('DELETE', path);
    }

    private params(method: string, url: string, body?: object, params?: {[x: string]: any}) {

        /**
         * 
         *   Request signing
         *
         *   All API requests must be signed in the following way:
         *
         *   Create a salted string of the form [METHOD]\u0000[URL]\u0000[BODY], where 
         *      [METHOD] is GET, POST, etc., 
         *      [URL] is the fully-qualified request URL including the apikey, nonce, timestamp and any other method parameters
         *      [BODY] is a JSON-encoded string (for POST, PATCH and DELETE requests) or empty (for GET requests). 
         *   Next, create a [SIGNATURE] from the salted string by applying a lower-case HMAC/SHA-256 transformation, using your API Secret, 
         *      and append it to your API request [URL] as the final query parameter: …&signature=[SIGNATURE] 
         *      (the resulting request [URL] should contain at least apikey, nonce, timestamp and signature parameters).
         *
         *   Notes: you must specify a Content-Type: application/json request header if [BODY] is JSON-encoded. 
         *      \u0000 is the unicode representation of the null byte (please ensure this character is represented 
         *      according to the conventions of your platform or framework, rather than including the literal string "\u0000"). 
         * 
         *      The apikey parameter is your supplied API Key. 
         *      The nonce parameter should be a UUID string and must be unique for each API request. 
         *      The timestamp parameter is the number of seconds since Jan 1, 1970 (UTC).
         */
        
        if (!params) {
            params = {};
        }

        params.apiKey = this.apiKey;
        params.nonce = uuidv4();
        params.timestamp = String(timestamp());
        
        let sigBase = method + '\u0000' + this.buildUrl(url, params) + '\u0000' + (body ? JSON.stringify(body): '');
        let signature = crypto.createHmac("sha256", this.apiSecret)
            .update(sigBase)
            .digest("hex")
            .toLowerCase();

        params.signature = signature;

        return params;
    }

    private buildUrl(url: string, params: {[x: string]: any}) {
        let urlObj = new URL(url, BASE_URL);

        for (let key in params) {
            urlObj.searchParams.set(key, params[key]);
        }

        return urlObj.toString();
    }

    requestToken(username: string, password: string) {
        if (this.accessToken) {
            throw new Error('You can not retrieve tokens on a client that has already been configured with a token. Create a client without providing any parameters to the constructor');
        }

        /**
         * 
            Authentication

            The Letterboxd API uses standard OAuth 2 Resource Owner and Refresh Token authorization flows to grant access to an 
                authenticated member via an access token, which may be refreshed at regular intervals to keep the member signed in. 
                When generating or refreshing an access token, make a form request to the /auth/token endpoint with 
                Content-Type: application/x-www-form-urlencoded and Accept: application/json headers, and request body parameters as follows:

                Request a token
                    grant_type Required 	string 	Use value: password
                    username Required 	string 	The member’s username or email address.
                    password Required 	string 	The member’s password.
                
                Refresh a token
                    grant_type Required 	string 	Use value: refresh_token
                    refresh_token Required 	string 	Your current refresh token value for the member.

            You must refresh a member’s access token before it expires, according to the expires_in parameter of the current refresh token. 
            If the access token expires, you’ll need to use the member’s credentials to generate a new token.
        */
        
        return this.req.post('/auth/token', {
            grant_type: 'password',
            username: username,
            password: password

        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        })
    }
}

function timestamp() {
    return Date.now();
}

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