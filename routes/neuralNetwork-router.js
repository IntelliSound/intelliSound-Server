'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const NeuralNetwork = require('../models/neuralNetwork');
const User = require('../models/user');

const neuralNetworkRouter = module.exports = new Router();

// user must be logged in to perform any actions on a saved network/save a network
neuralNetworkRouter.post(`/network`, jsonParser, bearerAuthMiddleware, (request, response, next) => {
  // need to add the neuralNetwork created through WaveRouter to the user's array of networks
  return User.findOne({_id: request.user._id})
    .then(user => {
      console.log(user, `user in the actual router`);
      if(user.neuralNetworks.length > 2){
        throw new Error('You must delete a neural network before you can save another');
      }
      user.neuralNetworks.push(request.body._id);
    }).save()
    .then(network => response.json(network))
    .catch(next);
});

neuralNetworkRouter.get('/network', bearerAuthMiddleware, (request, response, next) => {
  User.findById(request.user._id)
    .then(user => {
      console.log(user, `the user I foundByID`);
      if(!user){
        throw new httpErrors(404, `__ERROR__ user not found`);
      }
      let neuralNetworkArray = user.neuralNetworks;
      response.json(neuralNetworkArray);
    })
    .catch(next);
});

neuralNetworkRouter.put('/network/:networkID', jsonParser, bearerAuthMiddleware, (request, response, next) => {
  let options = {new: true};
  NeuralNetwork.findByIdAndUpdate(request.params.networkID, request.body, options)
    .then(network => {
      if(!network){
        throw new httpErrors(404, `__ERROR__ network not found`);
      }
      response.json(network);
    })
    .catch(next);
});

neuralNetworkRouter.delete('/network/:networkID', bearerAuthMiddleware, (request, response, next) => {
  NeuralNetwork.findByIdAndRemove(request.params.networkID)
    .then(network => {
      if(!network){
        throw new httpErrors(404, `__ERROR__ network not found`);
      }
      response.sendStatus(204);
    })
    .catch(next);
});
