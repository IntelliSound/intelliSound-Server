'use strict';
require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const userMockFactory = require('./lib/mock-factories/user-mock-factory');
const neuralNetworkMockFactory = require('./lib/mock-factories/neuralNetwork-mock-factory');
const placeholderNetwork = Network.fromJSON();

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`Neural Network Router`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(neuralNetworkMockFactory.remove);

  describe(`neural network POST request`, () => {
    test(`neural network POST request should return 200 and a network if there are no errors`, () => {
      let tempUserMock = {};
      return userMockFactory.create()
        .then(response => {
          tempUserMock.user = response.user;
          tempUserMock.token = response.token;
          return superagent.post(`${API_URL}/network`)
            .set('Authorization', `Bearer ${tempUserMock.token}`)
            .send({
              neuralNetwork: placeholderNetwork,
            })
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();
            });
        });
    });
  });
});
