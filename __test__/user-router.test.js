'use strict';
const superagent = require('superagent');
require('./setup');

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`testing user POST routes`, () => {
  test(`user POST request to /signup should return a test message on success`, () => {
    return superagent.post(`${API_URL}/signup`)
      .send({string: 'a potential user'})
      .then(response => {
        expect(response.body).toEqual('the POST request worked');
      });
  });
});

describe(`testing user GET routes`, () => {

  test(`user GET request to /login should return a test message on success`, () => {
    return superagent.get(`${API_URL}/login`)
      .then(response => {
        expect(response.body).toEqual('the GET request worked');
      })
      .catch(error => {
        console.log(error);
      });
  });
});
