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

  describe('Basic Request', () => {
    test('should return 200', () => {
      return superagent.get(`${API_URL}/`).then(response => {
        expect(response.status).toEqual(200);
      });
    });
  });

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

    test(`user POST request to /signup should return a 400 if there is not a full user posted`, () => {
      return Promise.resolve(superagent.post(`${API_URL}/signup`)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
        }))
        .catch(response => {
          expect(response.status).toBe(400);
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

    test(`user GET request to /login should return a 404 if there is invalid user`, () => {
      return Promise.resolve(userMockFactory.create()
        .then(mock => {
          return superagent.get(`${API_URL}/login`)
            .auth('bad username', mock.request.password);
        })) 
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    }); //TODO: nicholas delete me if not fixed

    test(`user GET request to /user should return a user object on success`, () => {
      let tempUserMock;
      return userMockFactory.create()
        .then(mock => {
          tempUserMock = mock.user;
          return superagent.get(`${API_URL}/user`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.username).toBe(tempUserMock.username);
        });
    });
  });
});
