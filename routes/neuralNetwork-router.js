'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const multer = require(multer);
const upload = multer({dest: `${__dirname}/../temp`});
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const neuralNetwork = require('../models/neuralNetwork');

const neuralNetworkRouter = module.exports = new Router();

// user must be logged in to perform any actions on a saved network
neuralNetworkRouter.post(`/network`, bearerAuthMiddleware, upload.any(), (request, response, next) => {
  console.log(request.body);
  if(request.files.length > 1 || request.files[0].fieldname !== 'wav'){ // if things break double check fieldnames match between frontend & backend
    return next(new httpErrors(400, `__ERROR__ invalid request`));
  }
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

neuralNetworkRouter.put('/network/:networkID');
neuralNetworkRouter.delete('/network/:networkID');
