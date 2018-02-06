'use strict';
require('./setup');
const faker = require('faker');
const superagent = require('superagent');
const server = require('../../lib/server');

const API_URL = `http://localhost:${process.env.PORT}`;

describe(`Neural Network Router`, () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe(`neural network POST request`, () => {
    test(``);
  });
});
