'use strict';

require('synaptic');
const neuralNetwork = require('../../../models/neuralNetwork');
const placeholderNetwork = require('../testNetwork');
const userMockFactory = require('./user-mock-factory');
console.log(placeholderNetwork, `placeholder network`);
const neuralNetworkMockFactory = module.exports = {};

neuralNetworkMockFactory.create = () => {
  let mock = {};
  return userMockFactory.create()
    .then(user => {
      mock.user = user;
      return new neuralNetwork({
        neuralNetwork: placeholderNetwork,
      }).save();
    })
    .then(network => {
      mock.neuralNetwork = network;
      return mock;
    });
};

neuralNetworkMockFactory.remove = () => neuralNetwork.remove({});
