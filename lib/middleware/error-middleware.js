'use strict';

const logger = require('../logger');

module.exports = (error, request, response, next) => {
  logger.log('__ERROR__ hitting error middleware');

  // errors coming from http
  if(error.status){
    logger.log('info', `responding with a ${error.status}`);
    return response.sendStatus(error.status);
  }

  // errors coming from mongoose
  let errorMessage = error.message.toLowerCase();
  if(errorMessage.includes(`validation failed`)){
    logger.log('info', `responding with a 400 status`);
    return response.sendStatus(400);
  }
  if(errorMessage.includes(`objectid failed`)){
    logger.log('info', `responding with a 404 status`);
    return response.sendStatus(404);
  }
  if(errorMessage.includes(`duplicate key error collection`)){
    logger.log(`info`, `responding with a 409 status`);
    return response.sendStatus(409);
  }
  if(errorMessage.includes(`unauthorized`)){
    logger.log(`info`, `responding with a 401 status`);
    return response.sendStatus(401);
  }
  if(errorMessage.includes(`jwt malformed`)){
    logger.log(`info`, `responding with a 401 status`);
    return response.sendStatus(401);
  }
  logger.log(`info`, `responding with a 500 status: general error because ${error.message}`);
  return response.sendStatus(500);
};
