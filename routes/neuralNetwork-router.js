'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const multer = require(multer);
const upload = multer({dest: `${__dirname}/../temp`});
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const neuralNetwork = require('../models/neuralNetwork');

const neuralNetworkRouter = module.exports = new Router();

// user must be logged in to perform any actions on a saved network
neuralNetworkRouter.post(`/network`, bearerAuthMiddleware, (request, response, next) => {
  console.log(`groot`);
  // console.log(request.body, `request body in network POST request`);
  return new neuralNetwork({
    neuralNetwork: request.body,
  }).save()
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
