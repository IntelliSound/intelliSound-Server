'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const NeuralNetwork = require('../models/neuralNetwork');
const User = require('../models/user');

const neuralNetworkRouter = module.exports = new Router();

// user must be logged in to perform any actions on a saved network
neuralNetworkRouter.post(`/network`, jsonParser, bearerAuthMiddleware, (request, response, next) => {
  // console.log(request.body, `request body in POST`);
  // return new NeuralNetwork({
  //   neuralNetwork: request.body.neuralNetwork,
  // }).save()

  // need to add the neuralNetwork to the user's array of networks
  return User.findOne({_id: request.user._id})
    .then(user => {
      user.neuralNetworks.push(request.body._id);
    })
    .then(network => response.json(network))
    .catch(next);
});

neuralNetworkRouter.get('/network', bearerAuthMiddleware, (request, response, next) => {
  NeuralNetwork.findOne({user: request.user._id})
    // .then(console.log(request.user, `user`))
    .then(network => {
      if(!network){
        throw new httpErrors(404, `__ERROR__ network not found`);
      }
      return network;
    })
    .catch(next);
});

neuralNetworkRouter.put('/network/:networkID', bearerAuthMiddleware, (request, response, next) => {});

neuralNetworkRouter.delete('/network/:networkID', bearerAuthMiddleware, (request, response, next) => {});
