'use strict';

const {Router} = require('express');
const {Network} = require('synaptic');
const fsx = require('fs-extra');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');
const NeuralNetworkModel = require('../models/neuralNetwork');
const User = require('../models/user');
const neuralNetwork = require('../lib/neural-net');
// const logger = require('../lib/logger');
const waveParser = require('../lib/sound-data-parser');
const waveWriter = require('../lib/wave-writer');

const neuralNetworkRouter = module.exports = new Router();

neuralNetworkRouter.post(`/neuralnetwork/save/:neuralnetname`, jsonParser, bearerAuthMiddleware, (request, response, next) => {
  if (!request.params.neuralnetname){
    throw new httpErrors('__ERROR__', 'Network must have a name');
  }
  return new NeuralNetworkModel({
    neuralNetwork: request.body,
    name: request.params.neuralnetname,
  }).save()
    .then(network => {
      request.user.neuralNetworks.push(network._id);
      return User.findByIdAndUpdate(request.user._id, request.user)
        .then(() => response.sendStatus(200))
        .catch(next);
    });
});

// user must be logged in to perform any actions on a saved network/save a network
neuralNetworkRouter.post(`/neuralnetwork/:wavename/:neuralnetname`, bearerAuthMiddleware, (request, response, next) => {
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
      const neuralNetworkToSave = JSON.stringify(parsedFile.neuralNet);

      return new NeuralNetworkModel({
        neuralNetwork: neuralNetworkToSave,
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

neuralNetworkRouter.get('/neuralnetwork/wave/:wavename', (request, response, next) => {

  if (!request.params.wavename) {
    throw new httpErrors('__ERROR__', 'User must select a wave to use');
  }

  const path = `${__dirname}/../assets/${request.params.wavename}.wav`;

  return fsx.readFile(path)
    .then(data => {
      let parsedFile = waveParser(data);
      parsedFile = neuralNetwork(parsedFile);
      const neuralGeneratedFile = waveWriter(parsedFile);
      const neuralNetworkToSave = JSON.stringify(parsedFile.neuralNet);
      return response.json({neuralNetworkToSave, neuralGeneratedFile});
    })
    .catch(next);
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


neuralNetworkRouter.put('/neuralnetwork/:networkID/:wavename', jsonParser, bearerAuthMiddleware, (request, response, next) => {
  let options = {isNew : true};
  const path = `${__dirname}/../assets/${request.params.wavename}.wav`;
  let neuralGeneratedFile = null;
  let foundNeuralNetwork = null;
  let newNeuralNetwork = null;

  //Nicholas- set up networktoupdate and get ready to train
  //Nicholas- train net and return trained network
  //Nicholas- take trained net and run findByIdAndUpdate on it

  return NeuralNetworkModel.findById(request.params.networkID)
    .then(foundNet => {
      foundNeuralNetwork = Network.fromJSON(JSON.parse(foundNet.neuralNetwork));
      return fsx.readFile(path)
        .then(data => {
          let parsedFile = waveParser(data);
          parsedFile = neuralNetwork(parsedFile, foundNeuralNetwork);
          neuralGeneratedFile = waveWriter(parsedFile);
          const neuralNetworkToSave = JSON.stringify(parsedFile.neuralNet);
          return NeuralNetworkModel.findByIdAndUpdate(request.params.networkID, neuralNetworkToSave, options);
        })
        .then(network => {
          newNeuralNetwork = network;
          request.user.neuralNetworks.push(newNeuralNetwork._id);
          return User.findByIdAndUpdate(request.user._id, request.user);
        })
        .then(() => response.json({newNeuralNetwork, neuralGeneratedFile}))
        .catch(next);
    });
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
