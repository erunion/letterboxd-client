export class MissingAccessTokenError extends Error {
  constructor() {
    super('MissingAccessToken');

    this.name = 'MissingAccessTokenError';
  }
}
