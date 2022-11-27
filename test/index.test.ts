import chai, { assert, expect } from 'chai';
import fetchMock from 'fetch-mock';

import Client from '../src';
import { BASE_URL } from '../src/lib/core';

import chaiPlugins from './helpers/chai-plugins';

chai.use(chaiPlugins);

interface MockedResponse {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

const apiKey = 'example-api-key';
const apiSecret = 'example-api-secret';
const accessToken = 'example-access-token';

describe('letterboxd-client', function () {
  beforeEach(function () {
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
      }
    );
  });

  afterEach(function () {
    fetchMock.restore();
  });

  describe('#auth', function () {
    describe('#requestAuthToken', function () {
      it('should request an auth token', async function () {
        const client = new Client(apiKey, apiSecret);
        const { status, data }: MockedResponse = await client.auth.requestAuthToken('user', 'hunter1');

        expect(status).to.be.a('number');
        expect(data.body).to.equal('grant_type=password&username=user&password=hunter1');
        expect(data.headers).to.have.header('content-type', 'application/x-www-form-urlencoded');
        expect(data.headers).not.to.have.property('authorization');

        const url = new URL(data.url);
        const params = Object.fromEntries(url.searchParams.entries());

        expect(url.pathname).to.equal('/api/v0/auth/token');
        expect(params).to.have.property('apikey', apiKey);
        expect(params)
          .to.have.property('nonce')
          .and.match(/([a-z0-9-]+)/);

        expect(params)
          .to.have.property('signature')
          .and.match(/([a-z0-9]+)/);

        expect(params).to.have.property('timestamp');
        expect(parseInt(params.timestamp, 10)).to.match(/\d{10}/);
      });
    });
  });

  describe('#film', function () {
    describe('#all', function () {
      it('should access a list of films', async function () {
        const client = new Client(apiKey, apiSecret);
        const { status, data }: MockedResponse = await client.film.all({
          perPage: 1,
          decade: 1960,
          sort: 'FilmPopularityThisWeek',
        });

        expect(status).to.be.a('number');
        expect(data.body).to.be.undefined;
        expect(data.headers).not.to.have.property('authorization');

        const url = new URL(data.url);
        const params = Object.fromEntries(url.searchParams.entries());

        expect(url.pathname).to.equal('/api/v0/films');
        expect(params).to.have.property('perPage', '1');
        expect(params).to.have.property('decade', '1960');
        expect(params).to.have.property('sort', 'FilmPopularityThisWeek');
        expect(params).to.have.property('apikey', apiKey);
        expect(params)
          .to.have.property('nonce')
          .and.match(/([a-z0-9-]+)/);

        expect(params)
          .to.have.property('signature')
          .and.match(/([a-z0-9]+)/);

        expect(params).to.have.property('timestamp');
        expect(parseInt(params.timestamp, 10)).to.match(/\d{10}/);
      });
    });
  });

  describe('#me', function () {
    describe('#get', function () {
      it('should throw an error if an access token has not been set up on the client', async function () {
        const client = new Client(apiKey, apiSecret);

        await client.me
          .get()
          .then(() => {
            assert.fail('A MissingAccessTokenError exception should have been thrown.');
          })
          .catch(err => {
            expect(err.name).to.equal('MissingAccessTokenError', err.message);
          });
      });

      it('should retrieve my user', async function () {
        const client = new Client(apiKey, apiSecret, accessToken);
        const { status, data }: MockedResponse = await client.me.get();

        expect(status).to.be.a('number');
        expect(data.body).to.be.undefined;
        expect(data.headers).to.have.header('authorization', `Bearer ${accessToken}`);

        const url = new URL(data.url);
        const params = Object.fromEntries(url.searchParams.entries());

        expect(url.pathname).to.equal('/api/v0/me');
        expect(params).to.have.property('apikey', apiKey);
        expect(params)
          .to.have.property('nonce')
          .and.match(/([a-z0-9-]+)/);

        expect(params)
          .to.have.property('signature')
          .and.match(/([a-z0-9]+)/);

        expect(params).to.have.property('timestamp');
        expect(parseInt(params.timestamp, 10)).to.match(/\d{10}/);
      });
    });
  });
});
