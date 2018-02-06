'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const neuralNetwork = require('../models/neuralNetwork');

const neuralNetworkRouter = module.exports = new Router();

// user must be logged in to perform any actions on a saved network
neuralNetworkRouter.post(`/network`, jsonParser, bearerAuthMiddleware, (request, response, next) => {
  return new neuralNetwork({
    neuralNetwork: request.body.neuralNetwork,
  }).save()
  // need to add the neuralNetwork to the user's array of networks
    .then(network => response.json(network))
    .catch(next);
});

neuralNetworkRouter.get('/network/:networkID', bearerAuthMiddleware, (request, response, next) => {
  neuralNetwork.findOne({user: request.user._id})
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
