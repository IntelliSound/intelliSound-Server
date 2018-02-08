'use strict';

const {Router} = require('express');
const fsx = require('fs-extra');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const NeuralNetworkModel = require('../models/neuralNetwork');
const User = require('../models/user');
const neuralNetwork = require('../lib/neural-net');
const logger = require('../lib/logger');
const waveParser = require('../lib/sound-data-parser');
const waveWriter = require('../lib/wave-writer');

const neuralNetworkRouter = module.exports = new Router();

neuralNetworkRouter.post(`/neuralnetwork/save/`);

// user must be logged in to perform any actions on a saved network/save a network
neuralNetworkRouter.post(`/neuralnetwork/:wavename/:neuralnetname`, jsonParser, bearerAuthMiddleware, (request, response, next) => {
  // need to add the neuralNetwork created through WaveRouter to the user's array of networks

  // Andrew - TODO: check where this error is handled or if it needs to be refactored
  if (!request.params.wavename){
    throw new httpErrors('__ERROR__', 'User must select a wave to use');
  }
  if (!request.params.neuralnetname){
    throw new httpErrors('__ERROR__', 'Network must have a name');
  }

  const path = `${__dirname}/../assets/${request.params.wavename}.wav`;
  let neuralGeneratedFile = null;
  let newNeuralNetwork = null;
  
  //Nicholas- put the wav file through a new neural net. then add its id to the user object and update user
  return fsx.readFile(path)
    .then(data => {
      let parsedFile = waveParser(data);
      parsedFile = neuralNetwork(parsedFile);
      neuralGeneratedFile = waveWriter(parsedFile);

      return new NeuralNetworkModel({
        neuralNetwork: parsedFile.neuralNet,
        name: request.params.neuralnetname,
      }).save()
        .then(network => {
          newNeuralNetwork = network;
          request.user.neuralNetworks.push(newNeuralNetwork._id);
          return User.findByIdAndUpdate(request.user._id, request.user)
            .then(() => response.json({newNeuralNetwork, neuralGeneratedFile}))
            .catch(next);
        });
    });
});


neuralNetworkRouter.get('/neuralnetwork/:networkID', bearerAuthMiddleware, (request, response, next) => {
  NeuralNetworkModel.findById(request.params.networkID)
    .then(network => {
      if(!network){
        throw new httpErrors(404, `__ERROR__ network not found`);
      }
      response.json(network);

    })
    .catch(next);
});


neuralNetworkRouter.put('/neuralnetwork/:networkID/:waveName', jsonParser, bearerAuthMiddleware, (request, response, next) => {
  let options = {isNew : true};
  let networkToUpdate = request.body;

  //Nicholas- set up networktoupdate and get ready to train
  //Nicholas- train net and return trained network
  //Nicholas- take trained net and run findByIdAndUpdate on it


  NeuralNetworkModel.findByIdAndUpdate(request.params.networkID, networkToUpdate, options)

    .then(network => {
      if(!network){
        throw new httpErrors(404, `__ERROR__ network not found`);
      }
      response.send(network);
    })
    .catch(next);
});


neuralNetworkRouter.delete('/neuralnetwork/:networkID', bearerAuthMiddleware, (request, response, next) => {
  NeuralNetworkModel.findByIdAndRemove(request.params.networkID)
    .then(network => {
      if(!network){
        throw new httpErrors(404, `__ERROR__ network not found`);
      }
      response.sendStatus(204);
    })
    .catch(next);
});
