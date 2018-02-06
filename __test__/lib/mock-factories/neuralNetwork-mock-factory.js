'use strict';

require('synaptic');
const neuralNetwork = require('../../../models/neuralNetwork');
const placeholderNetwork = require('../testNetwork');
console.log(placeholderNetwork);
const neuralNetworkMockFactory = module.exports = {};

neuralNetworkMockFactory.create = () => {
  let mock = {};
  return new neuralNetwork({
    neuralNetwork: placeholderNetwork,
  }).save()
    .then(network => {
      mock.neuralNetwork = network;
      return mock;
    });
};

neuralNetworkMockFactory.remove = () => neuralNetwork.remove({});
