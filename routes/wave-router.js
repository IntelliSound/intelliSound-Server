'use strict';
const {Router} = require('express');
const httpErrors = require('http-errors');
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../temp`});
const jsonParser = require('body-parser').json();
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const NeuralNetworkModel = require('../models/neuralNetwork');
// think we need to export the network as json from the neural-net file
const ActualNeuralNetwork = require('../lib/neural-net');
console.log(ActualNeuralNetwork, `the neural network Jake made`);

const WaveRouter = module.exports = new Router();

// user does NOT have to be logged in to upload a wave file and run it through the neural network
WaveRouter.post('/wave', upload.any(), (request, response, next) => {
  console.log(`groot`);
  if(request.files.length > 1){
    return next(new httpErrors(400, `__ERROR__ only one file can be uploaded at a time`));
  }
  return new NeuralNetworkModel({
    neuralNetwork: ActualNeuralNetwork,
  }); // we are not saving the neural network when a wave is posted (no .save()); only when the user is logged in can they save a network to their account, otherwise they get a template network they can train with the uploaded wave file
});


// user DOES have to be logged in to retrieve or update existing neural networks instead of working off the basic template network provided
WaveRouter.get('/wave/:neuralNetworkID', bearerAuthMiddleware, (request, response, next) => {});

WaveRouter.put('/wave/:sampleID', jsonParser, bearerAuthMiddleware, (request, response, next) => {});
