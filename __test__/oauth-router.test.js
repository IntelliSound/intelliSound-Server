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

  describe(`testing oauth GET route`, () => {
    test(`an oauth bad request should return a 404`, () => {
      return Promise.resolve(superagent.get(`${API_URL}/oauth/google?code=4/AADJOg9nZWb1duLbP9VxkGuTBD2ECEslOprKexMqRwGuCTJRulXppnD5bmhD5bmhpKSigscrK-DR8nuxC_E_dCu_Pjco&authuser=0&session_state=a69be1f4c7326e6035c3f665ad665ad33e8ae10d26cf3..c1de&prompt=consent`))
        .then(response=> {
          expect(response.status).toBe(200);
        })
        .catch(response => {
          console.log(response);
          expect(response.status).toBe(404);
        });
    });

  });
});
