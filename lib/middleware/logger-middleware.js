'use strict';

const logger = require('../logger');

module.exports = (request, response, next) => {
  logger.log(`info`, `There's a ${request.method} on ${request.url}`);
  return next();
};
