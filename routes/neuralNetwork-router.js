'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const NeuralNetwork = require('../models/neuralNetwork');
const User = require('../models/user');

const logger = require('../lib/logger');

const neuralNetworkRouter = module.exports = new Router();

//TODO: nicholas- we wont be posting a network, they should be saved and users update which ones they want references to
// user must be logged in to perform any actions on a saved network/save a network
neuralNetworkRouter.post(`/network`, jsonParser, bearerAuthMiddleware, (request, response, next) => {
  // need to add the neuralNetwork created through WaveRouter to the user's array of networks
  return User.findOne({_id: request.user._id})
    .then(user => {
      logger.log(user, `user in the actual router`);
      user.neuralNetworks.push(request.body._id);
    }).save()
    .then(network => response.json(network))
    .catch(next);
});

neuralNetworkRouter.get('/network/:networkID', bearerAuthMiddleware, (request, response, next) => {
  NeuralNetwork.findById(request.params.networkID)
    .then(network => {
      if(!network){
        throw new httpErrors(404, `__ERROR__ network not found`);
      }
      response.json(network);
    })
    .catch(next);
});

neuralNetworkRouter.put('/network/:networkID', jsonParser, bearerAuthMiddleware, (request, response, next) => {
  let options = {isNew : true};
  let networkToUpdate = request.body;

  NeuralNetwork.findByIdAndUpdate(request.params.networkID, networkToUpdate, options)
    .then(network => {
      if(!network){
        throw new httpErrors(404, `__ERROR__ network not found`);
      }
      response.send(network);
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
