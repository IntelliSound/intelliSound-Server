'use strict';

require('synaptic');
const neuralNetwork = require('../../../models/neuralNetwork');
const placeholderNetwork = require('../testNetwork');
const userMockFactory = require('./user-mock-factory');
const neuralNetworkMockFactory = module.exports = {};

neuralNetworkMockFactory.create = () => {
  let mock = {};
  return userMockFactory.create()
    .then(user => {
      mock.user = user;
      return mock.user.neuralNetwork = new neuralNetwork({
        neuralNetwork: placeholderNetwork,
      }).save()
        .then(mock => {return mock;});
    });
};

neuralNetworkMockFactory.remove = () => neuralNetwork.remove({});
