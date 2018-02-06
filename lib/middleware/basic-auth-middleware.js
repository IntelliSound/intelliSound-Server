'use strict';

const httpErrors = require('http-errors');
const User = require('../../models/user');

module.exports = (request, response, next) => {
  if(!request.headers.authorization){
    return next(new httpErrors(400, `__ERROR__ authorization header required`));
  }
  let base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if(!base64AuthHeader){
    return next(new httpErrors(400, `__ERROR__ basic authorization required`));
  }
  let stringAuthHeader = Buffer.from(base64AuthHeader, `base64`).toString();
  let [username, password] = stringAuthHeader.split(':');
  if(!username || ![password]){
    return next(new httpErrors(`__ERROR__ username and password required`));
  }

  // if the request had an authorization with password and username proceed to find a user
  return User.findOne({username})
    .then(user => {
      if(!user){
        throw new httpErrors(404, `__ERROR__ no user found`);
      }
      return user.verifyPassword(password);
    })
    // if a user was found, attach that user to the request object for future use
    .then(user => {
      request.user = user;
      return next();
    })
    .catch(next);
};
