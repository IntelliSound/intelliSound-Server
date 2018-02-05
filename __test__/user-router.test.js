'use strict';
require('./setup');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const userMockFactory = require('./mock-factories/user-mock-factory');

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`User router`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(userMockFactory.remove);

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
    });
  });

  describe(`testing user GET routes`, () => {
    test(`user GET request to /login should return a test message on success`, () => {
      return userMockFactory.create()
        .then(mock => {
          return superagent.get(`${API_URL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
  });
});
