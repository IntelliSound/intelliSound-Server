'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const User = require('../models/user');
const basicAuthMiddleware = require('../lib/middleware/basic-auth-middleware');
const bearerAuthMiddleware = require('../lib/middleware/bearer-middleware');


const userRouter = module.exports = new Router();

userRouter.post(`/signup`, jsonParser, (request, response, next) => {
  if(!request.body.username || !request.body.email || !request.body.password){
    return next(new httpErrors(400, `__ERROR__ username, email, and password are required`));
  }

  return User.create(request.body.username, request.body.email, request.body.password)
    .then(user => user.createToken())
    .then(token => {
      response.cookie('X-intelliSoundAi-Token', token, {maxAge: 900000});
      response.json({token});
    })
    .catch(next);
});

userRouter.get(`/login`, basicAuthMiddleware, (request, response, next) => {
  return request.user.createToken()
    .then(token => response.json({token}))
    .catch(next);
});

userRouter.get(`/user/me`, bearerAuthMiddleware, (request, response, next) => {
  return User.findOne({_id: request.user._id})
    .then(user => {
      return response.json(user);
    })
    .catch(next);
});
