'use strict';

const User = require('../../../models/user');
const faker = require('faker');
// const neuralNetworkMockFactory = require('./neuralNetwork-mock-factory');
const userMockFactory = module.exports = {};

userMockFactory.create = () => {
  let mock = {};
  mock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  return User.create(mock.request.username, mock.request.email, mock.request.password)
    .then(user => {
      mock.user = user;
      return user.createToken();
    })
    .then(token => {
      mock.token = token;
      return User.findById(mock.user._id);
    })
    .then(user => {
      mock.user = user;
      return mock;
    })
    .catch(error => console.error('error creating mock user: ', error));
};

userMockFactory.remove = () => User.remove({});
