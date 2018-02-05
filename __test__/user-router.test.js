'use strict';
require('./setup');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`User router`, () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe(`testing user POST routes`, () => {
    test(`user POST request to /signup should return a test message on success`, () => {
      return superagent.post(`${API_URL}/signup`)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .then(response => {
          expect(response.body.token).toBeTruthy();
        });
      // .catch(error => console.log(error));
    });
  });

  describe(`testing user GET routes`, () => {
    test(`user GET request to /login should return a test message on success`, () => {
      return superagent.get(`${API_URL}/login`)
        .then(response => {
          expect(response.body).toEqual('the GET request worked');
        });
    });
  });
});
