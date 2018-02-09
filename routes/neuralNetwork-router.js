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
const S3 = require('../lib/middleware/s3');
const uuid = require('uuid');

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

  const PATH = `${__dirname}/../assets/${request.params.wavename}.wav`;
  const TEMP_FILE_PATH = `${__dirname}/../temp/temp.wav`;
  const key = uuid.v1();
  let neuralGeneratedFile = null;
  let newNeuralNetwork = null;
  let awsURL = null;
  let neuralNetworkToSave = null;
  
  //Nicholas- put the wav file through a new neural net. then add its id to the user object and update user
  return fsx.readFile(PATH)
    .then(data => {
      let parsedFile = waveParser(data);
      parsedFile = neuralNetwork(parsedFile);
      neuralGeneratedFile = waveWriter(parsedFile);
      neuralNetworkToSave = JSON.stringify(parsedFile.neuralNet);
      return fsx.writeFile(TEMP_FILE_PATH, neuralGeneratedFile);
    })
    .then(() => {
      return S3.upload(TEMP_FILE_PATH, key);
    })
    .then(url => {
      awsURL = url;
      return new NeuralNetworkModel({
        neuralNetwork: neuralNetworkToSave,
        name: request.params.neuralnetname,
      }).save();
    })
    .then(network => {
      newNeuralNetwork = network;
      request.user.neuralNetworks.push(newNeuralNetwork._id);
      return User.findByIdAndUpdate(request.user._id, request.user)
        .then(() => response.json({newNeuralNetwork, awsURL}));
    })
    .catch(next);
    
});

neuralNetworkRouter.get('/neuralnetwork/wave/:wavename', (request, response, next) => {

  if (!request.params.wavename) {
    throw new httpErrors('__ERROR__', 'User must select a wave to use');
  }

  const PATH = `${__dirname}/../assets/${request.params.wavename}.wav`;
  const TEMP_FILE_PATH = `${__dirname}/../temp/temp.wav`;
  const key = uuid.v1();
  let neuralNetworkToSave = null;

  return fsx.readFile(PATH)
    .then(data => {
      let parsedFile = waveParser(data);
      parsedFile = neuralNetwork(parsedFile);
      const neuralGeneratedFile = waveWriter(parsedFile);
      neuralNetworkToSave = JSON.stringify(parsedFile.neuralNet);
      return fsx.writeFile(TEMP_FILE_PATH, neuralGeneratedFile);
    })
    .then(() => {
      return S3.upload(TEMP_FILE_PATH, key);
    })
    .then(url => {
      const awsURL = url;
      return response.json({neuralNetworkToSave, awsURL});
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
  let neuralGeneratedFile = null;
  let foundNeuralNetwork = null;
  let newNeuralNetwork = null;
  const PATH = `${__dirname}/../assets/${request.params.wavename}.wav`;
  const TEMP_FILE_PATH = `${__dirname}/../temp/temp.wav`;
  const key = uuid.v1();
  let awsURL = null;
  let neuralNetworkToSave = null;
  //Nicholas- set up networktoupdate and get ready to train
  //Nicholas- train net and return trained network
  //Nicholas- take trained net and run findByIdAndUpdate on it

  return NeuralNetworkModel.findById(request.params.networkID)
    .then(foundNet => {
      foundNeuralNetwork = Network.fromJSON(JSON.parse(foundNet.neuralNetwork));
      return fsx.readFile(PATH);
    })
    .then(data => {
      let parsedFile = waveParser(data);
      parsedFile = neuralNetwork(parsedFile, foundNeuralNetwork);
      neuralGeneratedFile = waveWriter(parsedFile);
      neuralNetworkToSave = JSON.stringify(parsedFile.neuralNet);
      
      return fsx.writeFile(TEMP_FILE_PATH, neuralGeneratedFile);
    })
    .then(() => {
      return S3.upload(TEMP_FILE_PATH, key);
    })
    .then(url => {
      awsURL = url;
      return NeuralNetworkModel.findByIdAndUpdate(request.params.networkID, neuralNetworkToSave, options);
    })
    .then(network => {
      newNeuralNetwork = network;
      request.user.neuralNetworks.push(newNeuralNetwork._id);
      return User.findByIdAndUpdate(request.user._id, request.user);
    })
    .then(() => response.json({newNeuralNetwork, awsURL}))
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
