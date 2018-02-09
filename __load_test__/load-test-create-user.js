'use strict';
const faker = require('faker');
const mockUser = module.exports = {};

mockUser.create = (userContext, events, done) => {
  userContext.vars.username = faker.internet.userName();
  userContext.vars.email = faker.internet.email();
  userContext.vars.password = faker.internet.password();

  return done();
};
