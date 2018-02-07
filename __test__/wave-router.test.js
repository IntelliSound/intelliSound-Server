'use strict';
require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
// const userMockFactory = require('./lib/mock-factories/user-mock-factory');
// const neuralNetworkMockFactory = require('./lib/mock-factories/neuralNetwork-mock-factory');
// const testNetwork = require('./lib/testNetwork');
// const placeholderNetwork = JSON.stringify(testNetwork);

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`Wave Router tests`, () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe(`Wave Router POST request`, () => {
    test(`wave file POST request should return 200, a networkID, and a new wave file if there are no errors`, () => {
      return superagent.post(`${API_URL}/wave`)
        .field('wavename', 'random')
        .attach('wave', `${__dirname}/assets/Broken_Robot5.wav`);
      // .then(response => console.log(response, `is the response`));
    });
  });
});
