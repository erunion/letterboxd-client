export default class Client {
    private accessToken;
    private req;
    private apiKey;
    private apiSecret;
    constructor(apiKey: string, apiSecret: string, accessToken?: string);
    private requireAccessToken;
    private request;
    get(path: string): any;
    post(path: string, body: object, headers?: object): any;
    patch(path: string, body: object): any;
    delete(path: string): any;
    private params;
    private buildUrl;
    requestToken(username: string, password: string): any;
}
