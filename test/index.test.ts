import crypto from 'crypto';

import fetchMock from 'fetch-mock';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import Client from '../src';
import { BASE_URL } from '../src/lib/core';
import { MissingAccessTokenError } from '../src/lib/errors';

interface MockedResponse {
  // biome-ignore lint/suspicious/noExplicitAny: We don't know what this is.
  data: Record<string, any>;
  status: number;
}

const apiKey = 'example-api-key';
const apiSecret = 'example-api-secret';
const accessToken = 'example-access-token';

describe('letterboxd-client', () => {
  beforeEach(() => {
    fetchMock.mock(
      {
        url: `begin:${BASE_URL}`,
      },
      (url, options) => {
        const headers = new Headers(options.headers);

        let body = options.body;
        if (headers.get('Content-Type') === 'application/x-www-form-urlencoded') {
          body = options.body?.toString();
        }

        return { url, headers: Object.fromEntries(headers), body };
      },
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('.auth', () => {
    describe('.requestAuthToken()', () => {
      it('should request an auth token', async () => {
        const client = new Client(apiKey, apiSecret);
        const { status, data }: MockedResponse = await client.auth.requestAuthToken('user', 'hunter1');

        expect(status).toBe(200);
        expect(data.body).toBe('grant_type=password&username=user&password=hunter1');
        expect(data.headers).toHaveProperty('content-type', 'application/x-www-form-urlencoded');
        expect(data.headers).not.toHaveProperty('authorization');

        const url = new URL(data.url);
        const params = Object.fromEntries(url.searchParams.entries());

        expect(url.pathname).toBe('/api/v0/auth/token');
        expect(params).toStrictEqual({
          apikey: apiKey,
          nonce: expect.stringMatching(/([a-z0-9-]+)/),
          signature: expect.stringMatching(/([a-z0-9]+)/),
          timestamp: expect.stringMatching(/\d{10}/),
        });
      });
    });

    describe('.createPkcePair()', () => {
      it('should create a PKCE pair', () => {
        const client = new Client(apiKey, apiSecret);
        const pair = client.auth.createPkcePair();

        expect(pair).toHaveProperty('codeVerifier');
        expect(pair).toHaveProperty('codeChallenge');
        expect(pair.codeVerifier.length).toBeGreaterThan(10);

        const expectedChallenge = crypto.createHash('sha256').update(pair.codeVerifier).digest('base64url');
        expect(pair.codeChallenge).toBe(expectedChallenge);
      });
    });

    describe('.buildAuthorizationUrl()', () => {
      it('should build an OAuth authorization URL', () => {
        const client = new Client(apiKey, apiSecret);
        const authorizeUrl = client.auth.buildAuthorizationUrl({
          authorizationEndpoint: 'https://example.com/oauth/authorize',
          codeChallenge: 'challenge',
          redirectUri: 'https://example.com/callback',
          scope: ['read', 'write'],
          state: 'state-123',
        });

        const url = new URL(authorizeUrl);
        expect(url.origin + url.pathname).toBe('https://example.com/oauth/authorize');
        expect(Object.fromEntries(url.searchParams.entries())).toStrictEqual({
          client_id: apiKey,
          code_challenge: 'challenge',
          code_challenge_method: 'S256',
          redirect_uri: 'https://example.com/callback',
          response_type: 'code',
          scope: 'read write',
          state: 'state-123',
        });
      });
    });

    describe('.exchangeAuthorizationCode()', () => {
      it('should exchange an authorization code for an access token', async () => {
        const client = new Client(apiKey, apiSecret);
        const { status, data }: MockedResponse = await client.auth.exchangeAuthorizationCode({
          code: 'oauth-code',
          codeVerifier: 'verifier',
          redirectUri: 'http://localhost:4173/callback',
        });

        expect(status).toBe(200);
        expect(data.headers).toHaveProperty('content-type', 'application/x-www-form-urlencoded');

        const url = new URL(data.url);
        expect(url.pathname).toBe('/api/v0/auth/token');

        const params = Object.fromEntries(url.searchParams.entries());
        expect(params).toHaveProperty('apikey', apiKey);
        expect(params).toHaveProperty('nonce');
        expect(params).toHaveProperty('signature');
        expect(params).toHaveProperty('timestamp');

        expect(data.body).toBe(
          'grant_type=authorization_code&code=oauth-code&code_verifier=verifier&redirect_uri=http%3A%2F%2Flocalhost%3A4173%2Fcallback',
        );
      });
    });

    describe('.refreshAccessToken()', () => {
      it('should refresh an access token', async () => {
        const client = new Client(apiKey, apiSecret);
        const { status, data }: MockedResponse = await client.auth.refreshAccessToken('refresh-token');

        expect(status).toBe(200);
        expect(data.headers).toHaveProperty('content-type', 'application/x-www-form-urlencoded');

        const url = new URL(data.url);
        expect(url.pathname).toBe('/api/v0/auth/token');

        const params = Object.fromEntries(url.searchParams.entries());
        expect(params).toHaveProperty('apikey', apiKey);

        expect(data.body).toBe('grant_type=refresh_token&refresh_token=refresh-token');
      });
    });
  });

  describe('.film', () => {
    describe('.all()', () => {
      it('should access a list of films', async () => {
        const client = new Client(apiKey, apiSecret);
        const { status, data }: MockedResponse = await client.film.all({
          perPage: 1,
          decade: 1960,
          sort: 'FilmPopularityThisWeek',
        });

        expect(status).toBe(200);
        expect(data.body).toBeUndefined();
        expect(data.headers).not.toHaveProperty('authorization');

        const url = new URL(data.url);
        const params = Object.fromEntries(url.searchParams.entries());

        expect(url.pathname).toBe('/api/v0/films');
        expect(params).toStrictEqual({
          perPage: '1',
          decade: '1960',
          sort: 'FilmPopularityThisWeek',
          apikey: apiKey,
          nonce: expect.stringMatching(/([a-z0-9-]+)/),
          signature: expect.stringMatching(/([a-z0-9]+)/),
          timestamp: expect.stringMatching(/\d{10}/),
        });
      });

      it('should access films with OAuth token without signature', async () => {
        const client = new Client(apiKey, apiSecret, accessToken);
        const { status, data }: MockedResponse = await client.film.all({
          perPage: 1,
          decade: 1960,
          sort: 'FilmPopularityThisWeek',
        });

        expect(status).toBe(200);
        expect(data.body).toBeUndefined();
        expect(data.headers).toHaveProperty('authorization', `Bearer ${accessToken}`);

        const url = new URL(data.url);
        const params = Object.fromEntries(url.searchParams.entries());

        expect(url.pathname).toBe('/api/v0/films');
        expect(params).toStrictEqual({
          perPage: '1',
          decade: '1960',
          sort: 'FilmPopularityThisWeek',
        });
      });
    });
  });

  describe('.me', () => {
    describe('.get()', () => {
      it('should throw an error if an access token has not been set up on the client', async () => {
        const client = new Client(apiKey, apiSecret);
        await expect(client.me.get()).rejects.toThrow(MissingAccessTokenError);
      });

      it('should retrieve my user using OAuth token without signature', async () => {
        const client = new Client(apiKey, apiSecret, accessToken);
        const { status, data }: MockedResponse = await client.me.get();

        expect(status).toBe(200);
        expect(data.body).toBeUndefined();
        expect(data.headers).toHaveProperty('authorization', `Bearer ${accessToken}`);

        const url = new URL(data.url);
        const params = Object.fromEntries(url.searchParams.entries());

        expect(url.pathname).toBe('/api/v0/me');
        expect(params).toStrictEqual({});
      });
    });
  });
});
