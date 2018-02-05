'use strict';
const superagent = require('superagent');
require('./setup');

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`testing user routes`, () => {
  test(`user post request to /signup`, () => {
    return superagent.post(`${API_URL}/signup`)
      .send('a potential user')
      .then(response => {
        expect(response.status).toEqual(200);
      });
  });
});
