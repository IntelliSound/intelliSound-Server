'use strict';
const {Router} = require('express');
const httpErrors = require('http-errors');
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const NeuralNetworkModel = require('../models/neuralNetwork');
const ActualNeuralNetwork = require('../lib/neural-net');

const WaveRouter = module.exports = new Router();

// user does NOT have to be logged in to upload a wave file and run it through the neural network
// upload adds a 'body' and 'file/files' object to the request
WaveRouter.post('/wave', upload.any(), (request, response, next) => {
  if(request.files.length > 1){
    return next(new httpErrors(400, `__ERROR__ only one file can be uploaded at a time`));
  }
  return new NeuralNetworkModel({
    neuralNetwork: ActualNeuralNetwork,
  })
    .then(network => {
      response.json(network._id);
    });// we are not saving the neural network when a wave is posted (no .save()); only when the user is logged in can they save a network to their account, otherwise they get a template network they can train with the uploaded wave file
});


// user DOES have to be logged in to retrieve or update existing neural networks instead of working off the basic template network provided
WaveRouter.get('/wave/:neuralNetworkID', bearerAuthMiddleware, (request, response, next) => {});

WaveRouter.put('/wave/:sampleID', bearerAuthMiddleware, (request, response, next) => {});
