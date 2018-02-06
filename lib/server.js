'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT;

let serverIsOn = false;
let httpServer = null;

mongoose.Promise = Promise;

// middleware must be in this order or the chain will break/behave unexpectedly
app.use(require('./middleware/logger-middleware'));
app.use(require('../routes/user-router'));

const server = module.exports = {};

app.use(require('./middleware/error-middleware'));

server.start = () => {
  return new Promise((resolve, reject) => {
    if(serverIsOn){
      return reject(new Error('__SERVER_ERROR__ server is already on'));
    }
    if(!PORT){
      return reject(new Error('__SERVER_ERROR__ PORT is not configured'));
    }
    httpServer = app.listen(PORT, () => {
      serverIsOn = true;
      return resolve();
    });
  })
    .then(mongoose.connect(process.env.MONGODB_URI));
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!serverIsOn){
      return reject(new Error('__SERVER_ERROR__ server is already off'));
    }
    if(!httpServer){
      return reject(new Error('__SERVER_ERROR__ cannot shut down server; server does not exist'));
    }
    httpServer.close(() => {
      serverIsOn = false;
      httpServer = null;
      return resolve();
    });
  })
    .then(mongoose.disconnect());
};
