export default class Client {
    private accessToken;
    private req;
    private apiKey;
    private apiSecret;
    constructor(apiKey: string, apiSecret: string, accessToken?: string);
    private requireAccessToken;
    private request;
    get(path: string, params?: object): Promise<import("axios").AxiosResponse<any>>;
    post(path: string, body: object, headers?: object): Promise<import("axios").AxiosResponse<any>>;
    patch(path: string, body: object): Promise<import("axios").AxiosResponse<any>>;
    delete(path: string): Promise<import("axios").AxiosResponse<any>>;
    private params;
    private buildUrl;
    requestToken(username: string, password: string): Promise<import("axios").AxiosResponse<any>>;
}
