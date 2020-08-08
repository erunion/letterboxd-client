export default class Client {
    private accessToken;
    private apiKey;
    private apiSecret;
    constructor(apiKey: string, apiSecret: string, accessToken?: string);
    get(path: string, params?: object): any;
    post(path: string, body: object, headers?: object): any;
    patch(path: string, body: object): any;
    delete(path: string): any;
    requestToken(username: string, password: string): any;
    private request;
    private applyAuth;
    private params;
    private buildUrl;
}
