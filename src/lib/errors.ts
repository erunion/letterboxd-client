export class MissingAccessTokenError extends Error {
  constructor() {
    super('This endpoint requires the client to be set up with a user access token.');

    this.name = 'MissingAccessTokenError';
  }
}
