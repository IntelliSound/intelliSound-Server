'use strict';
require('./lib/setup');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const userMockFactory = require('./lib/mock-factories/user-mock-factory');

const API_URL = `http://localhost:${process.env.PORT}`;

// need to add tests for fail cases

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
    test(`user GET request to /user/me should return a user object on success`, () => {
      let tempUserMock;
      return userMockFactory.create()
        .then(mock => {
          tempUserMock = mock.user;
          return superagent.get(`${API_URL}/user/me`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          console.log(response.body._id);
          console.log(tempUserMock);
          expect(response.body.username).toBe(tempUserMock.username);
          expect(response.body.email).toBe(tempUserMock.email);
          expect(response.body._id).toBe(tempUserMock._id.toString());
        });
    });
  });
});
