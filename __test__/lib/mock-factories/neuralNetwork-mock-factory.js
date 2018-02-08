'use strict';

require('synaptic');
const faker = require('faker');
const neuralNetwork = require('../../../models/neuralNetwork');
const testNetwork = require('../testNetwork');
const placeholderNetwork = JSON.stringify(testNetwork);
const userMockFactory = require('./user-mock-factory');
const User = require('../../../models/user');
const neuralNetworkMockFactory = module.exports = {};

neuralNetworkMockFactory.create = () => {
  let mock = {};
  return userMockFactory.create()
    .then(response => {
      mock.token = response.token;
      mock.user = response.user;
      mock.netArray = response.user.neuralNetworks;
      return new neuralNetwork({
        neuralNetwork: placeholderNetwork,
        name: faker.hacker.noun(),
      }).save()
        .then(network => {
          mock.netArray.push(network._id);
          mock.networkID = network._id;
          let options = {new: true};
          User.findByIdAndUpdate(mock.user._id, {neuralNetworks: [...mock.netArray]}, options);
          return mock;
        });
    });
};

neuralNetworkMockFactory.remove = () => neuralNetwork.remove({});
