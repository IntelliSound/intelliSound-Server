'use strict';
require('./setup');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../../lib/server');
const userMockFactory = require('./mock-factories/user-mock-factory');
const neuralNetworkMockFactory = require('./mock-factories/neuralNetwork-mock-factory');

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`Neural Network Router`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(neuralNetworkMockFactory.remove);

  describe(`neural network POST request`, () => {
    test(`neural network POST request should return 200 and a network if there are no errors`, () => {
      let tempUserMock = null;
      return userMockFactory.create()
        .then(user => {
          tempUserMock = user;
          return superagent.post(`${API_URL}/network`)
            .set('Authorization', `Bearer ${tempUserMock.token}`)
            .attach('wav', `${__dirname}/assets/Broken_Robot5.wav`)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();
            });
        });
    });
  });
});
