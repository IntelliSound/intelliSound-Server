'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');

const neuralNetworkRouter = module.exports = new Router();

// user must be logged in to perform any actions on a saved network
neuralNetworkRouter.post(`/network`, bearerAuthMiddleware, (request, response, next) => {

});
neuralNetworkRouter.get('/network/:networkID');
neuralNetworkRouter.put('/network/:networkID');
neuralNetworkRouter.delete('/network/:networkID');
