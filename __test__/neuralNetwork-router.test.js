'use strict';
require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const userMockFactory = require('./lib/mock-factories/user-mock-factory');
const neuralNetworkMockFactory = require('./lib/mock-factories/neuralNetwork-mock-factory');
const testNetwork = require('./lib/testNetwork');
const placeholderNetwork = JSON.stringify(testNetwork);

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
            .send({neuralNetwork: testNetwork});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
        });
    });
  });

  describe(`neural network GET request`, () => {
    test(`neural network GET request should return a 200 status and all of the user's networks if there are no errors`, () => {
      let tempUserMock = {};
      return userMockFactory.create()
        .then(response => {
          tempUserMock.user = response.user;
          tempUserMock.token = response.token;
          return superagent.get(`${API_URL}/network`)
            .set('Authorization', `Bearer ${tempUserMock.token}`);
        });
    });
  });

  describe(`testing`, () => {
    test(`braces don't line up`, () => {
      let tempUserMock = {};
      return userMockFactory.create()
        .then(response => {
          tempUserMock.user = response.user;
          tempUserMock.token = response.token;
          return neuralNetworkMockFactory.create()
            .then(response => {
              console.log(response, `is the response`);
              tempUserMock.user = response;
              console.log(tempUserMock.user, `is the updated user`);
            });
        });
    });
  });

  // describe(`neural network DELETE request`, () => {
  //   test(`neural network DELETE request should return a 204 status if there are no errors`, () => {
  //     let tempUserMock = {};
  //     return userMockFactory.create()
  //       .then(response => {
  //         tempUserMock.user = response.user;
  //         tempUserMock.token = response.token;
  //         return superagent.get(`${API_URL}/network`)
  //           .set('Authorization', `Bearer ${tempUserMock.token}`);
  //       });
  //   });
  // });
});
