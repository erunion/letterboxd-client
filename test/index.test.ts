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
    });
  });

  describe('.me', () => {
    describe('.get()', () => {
      it('should throw an error if an access token has not been set up on the client', async () => {
        const client = new Client(apiKey, apiSecret);
        await expect(client.me.get()).rejects.toThrow(MissingAccessTokenError);
      });

      it('should retrieve my user', async () => {
        const client = new Client(apiKey, apiSecret, accessToken);
        const { status, data }: MockedResponse = await client.me.get();

        expect(status).toBe(200);
        expect(data.body).toBeUndefined();
        expect(data.headers).toHaveProperty('authorization', `Bearer ${accessToken}`);

        const url = new URL(data.url);
        const params = Object.fromEntries(url.searchParams.entries());

        expect(url.pathname).toBe('/api/v0/me');
        expect(params).toStrictEqual({
          apikey: apiKey,
          nonce: expect.stringMatching(/([a-z0-9-]+)/),
          signature: expect.stringMatching(/([a-z0-9]+)/),
          timestamp: expect.stringMatching(/\d{10}/),
        });
      });
    });
  });
});
