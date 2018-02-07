'use strict';

require('synaptic');
const neuralNetwork = require('../../../models/neuralNetwork');
const testArray = require('../testNetwork');
const placeholderNetwork = JSON.stringify(testArray);
const userMockFactory = require('./user-mock-factory');
// const User = require('../../../models/user');
const neuralNetworkMockFactory = module.exports = {};

neuralNetworkMockFactory.create = () => {
  let mock = {};
  return userMockFactory.create()
    .then(response => {
      mock.user = response.user;
      mock.netArray = response.user.neuralNetworks;
      return new neuralNetwork({
        neuralNetwork: placeholderNetwork,
      }).save()
        .then(network => {
          mock.netArray.push(network._id);
          mock.networkID = network._id;
          return mock;
          // return User.findByIdAndUpdate(mock.user._id, {neuralNetworks: [...mock.netArray]});
        });
    });
};

neuralNetworkMockFactory.remove = () => neuralNetwork.remove({});
