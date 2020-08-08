"use strict";

import Client from '../../index';
let config = require('../config.json');

describe('request tests', () => {
	/**
	 *
	 */
	test('requestToken', () => {
		expect.assertions(2);
		let foo = new Client(config.apiKey, config.apiSecret);

		return foo.requestToken(config.username, config.password)
		.then((res) => {
			expect(res.res.status).toEqual(200);
			expect(res.json).toHaveProperty('access_token');
		});
	});

	test('get', () => {
		expect.assertions(2);

		const client = new Client(config.apiKey, config.apiSecret, config.accessToken);
		return client.get('/film/lnXw/statistics').then(res => {
			expect(res.res.status).toEqual(200);
			expect(res.json.film.id).toEqual('lnXw');
		});
	});
});
